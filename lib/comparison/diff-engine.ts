import type {
  ValidationResponse,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from '../validation/types';

type ValidationIssue = ValidationError | ValidationWarning;
import type {
  ComparisonResult,
  SchemaDiff,
  ComparisonOptions,
} from './types';

export class DiffEngine {
  compare(
    before: ValidationResponse,
    after: ValidationResponse,
    options: ComparisonOptions = {}
  ): ComparisonResult {
    const schemas = this.compareSchemas(before.schemas, after.schemas, options);
    const summary = this.calculateSummary(before, after, schemas);
    const insights = this.generateInsights(summary, schemas);

    return {
      before,
      after,
      summary,
      schemas,
      insights,
      timestamp: new Date().toISOString(),
    };
  }

  private compareSchemas(
    beforeSchemas: ValidationResult[],
    afterSchemas: ValidationResult[],
    options: ComparisonOptions
  ): SchemaDiff[] {
    const diffs: SchemaDiff[] = [];
    const processedAfterIndices = new Set<number>();

    // Find matching schemas and detect changes
    beforeSchemas.forEach((beforeSchema) => {
      const matchIndex = afterSchemas.findIndex(
        (afterSchema, idx) =>
          !processedAfterIndices.has(idx) &&
          this.schemasMatch(beforeSchema, afterSchema)
      );

      if (matchIndex >= 0) {
        processedAfterIndices.add(matchIndex);
        const afterSchema = afterSchemas[matchIndex];
        const changes = this.detectChanges(beforeSchema, afterSchema, options);
        const hasChanges = this.hasSignificantChanges(changes, options);

        diffs.push({
          type: beforeSchema.schema.type,
          changeType: hasChanges ? 'modified' : 'unchanged',
          before: beforeSchema,
          after: afterSchema,
          changes,
        });
      } else {
        // Schema was removed
        diffs.push({
          type: beforeSchema.schema.type,
          changeType: 'removed',
          before: beforeSchema,
          changes: {},
        });
      }
    });

    // Find newly added schemas
    afterSchemas.forEach((afterSchema, idx) => {
      if (!processedAfterIndices.has(idx)) {
        diffs.push({
          type: afterSchema.schema.type,
          changeType: 'added',
          after: afterSchema,
          changes: {},
        });
      }
    });

    return diffs;
  }

  private schemasMatch(
    schema1: ValidationResult,
    schema2: ValidationResult
  ): boolean {
    // Match by type and key properties
    if (schema1.schema.type !== schema2.schema.type) {
      return false;
    }

    // Try to match by name or headline
    const name1 = this.getSchemaIdentifier(schema1);
    const name2 = this.getSchemaIdentifier(schema2);

    if (name1 && name2) {
      return name1 === name2;
    }

    // If no identifier, consider them matching by type only
    return true;
  }

  private getSchemaIdentifier(schema: ValidationResult): string | null {
    const props = schema.schema.properties;
    return (
      (props.name as string) ||
      (props.headline as string) ||
      (props.title as string) ||
      (props['@id'] as string) ||
      null
    );
  }

  private detectChanges(
    before: ValidationResult,
    after: ValidationResult,
    options: ComparisonOptions
  ) {
    const changes: SchemaDiff['changes'] = {};

    // Score changes
    if (before.seoScore !== after.seoScore) {
      const delta = after.seoScore - before.seoScore;
      changes.score = {
        before: before.seoScore,
        after: after.seoScore,
        delta,
        improvement: delta > 0,
      };
    }

    // Completeness changes
    if (before.completeness !== after.completeness) {
      const delta = after.completeness - before.completeness;
      changes.completeness = {
        before: before.completeness,
        after: after.completeness,
        delta,
        improvement: delta > 0,
      };
    }

    // Rich Results eligibility changes
    if (before.richResultsEligible !== after.richResultsEligible) {
      changes.richResultsEligibility = {
        before: before.richResultsEligible,
        after: after.richResultsEligible,
        changed: true,
        improvement: after.richResultsEligible,
      };
    }

    // Error changes
    if (!options.ignoreWarnings) {
      changes.errors = this.compareIssues(before.errors, after.errors);
      changes.warnings = this.compareIssues(before.warnings, after.warnings);
    } else {
      changes.errors = this.compareIssues(before.errors, after.errors);
    }

    // Property changes
    changes.properties = this.compareProperties(
      before.schema.properties,
      after.schema.properties
    );

    return changes;
  }

  private compareIssues(
    beforeIssues: ValidationIssue[],
    afterIssues: ValidationIssue[]
  ) {
    const fixed: Array<{ property: string; message: string }> = [];
    const unchanged: Array<{ property: string; message: string }> = [];
    const newIssues: Array<{ property: string; message: string }> = [];

    // Find fixed and unchanged issues
    beforeIssues.forEach((beforeIssue) => {
      const stillExists = afterIssues.some(
        (afterIssue) =>
          afterIssue.property === beforeIssue.property &&
          afterIssue.message === beforeIssue.message
      );

      if (stillExists) {
        unchanged.push({
          property: beforeIssue.property || 'general',
          message: beforeIssue.message,
        });
      } else {
        fixed.push({
          property: beforeIssue.property || 'general',
          message: beforeIssue.message,
        });
      }
    });

    // Find new issues
    afterIssues.forEach((afterIssue) => {
      const isNew = !beforeIssues.some(
        (beforeIssue) =>
          beforeIssue.property === afterIssue.property &&
          beforeIssue.message === afterIssue.message
      );

      if (isNew) {
        newIssues.push({
          property: afterIssue.property || 'general',
          message: afterIssue.message,
        });
      }
    });

    return {
      fixed,
      new: newIssues,
      unchanged,
    };
  }

  private compareProperties(
    beforeProps: Record<string, unknown>,
    afterProps: Record<string, unknown>
  ) {
    const added: string[] = [];
    const removed: string[] = [];
    const modified: Array<{
      property: string;
      before: unknown;
      after: unknown;
    }> = [];

    // Find added and modified properties
    Object.keys(afterProps).forEach((key) => {
      if (!(key in beforeProps)) {
        added.push(key);
      } else if (!this.deepEqual(beforeProps[key], afterProps[key])) {
        modified.push({
          property: key,
          before: beforeProps[key],
          after: afterProps[key],
        });
      }
    });

    // Find removed properties
    Object.keys(beforeProps).forEach((key) => {
      if (!(key in afterProps)) {
        removed.push(key);
      }
    });

    return { added, removed, modified };
  }

  private deepEqual(obj1: unknown, obj2: unknown): boolean {
    if (obj1 === obj2) return true;

    if (
      typeof obj1 !== 'object' ||
      typeof obj2 !== 'object' ||
      obj1 === null ||
      obj2 === null
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1 as object);
    const keys2 = Object.keys(obj2 as object);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (
        !this.deepEqual(
          (obj1 as Record<string, unknown>)[key],
          (obj2 as Record<string, unknown>)[key]
        )
      ) {
        return false;
      }
    }

    return true;
  }

  private hasSignificantChanges(
    changes: SchemaDiff['changes'],
    options: ComparisonOptions
  ): boolean {
    const threshold = options.scoreThreshold || 1;

    // Check for score changes
    if (changes.score && Math.abs(changes.score.delta) >= threshold) {
      return true;
    }

    // Check for completeness changes
    if (
      changes.completeness &&
      Math.abs(changes.completeness.delta) >= threshold
    ) {
      return true;
    }

    // Check for Rich Results eligibility changes
    if (changes.richResultsEligibility?.changed) {
      return true;
    }

    // Check for error changes
    if (
      changes.errors &&
      (changes.errors.fixed.length > 0 || changes.errors.new.length > 0)
    ) {
      return true;
    }

    // Check for warning changes (if not ignored)
    if (
      !options.ignoreWarnings &&
      changes.warnings &&
      (changes.warnings.fixed.length > 0 || changes.warnings.new.length > 0)
    ) {
      return true;
    }

    // Check for property changes (if not ignoring optional fields)
    if (
      !options.ignoreOptionalFields &&
      changes.properties &&
      (changes.properties.added.length > 0 ||
        changes.properties.removed.length > 0 ||
        changes.properties.modified.length > 0)
    ) {
      return true;
    }

    return false;
  }

  private calculateSummary(
    before: ValidationResponse,
    after: ValidationResponse,
    schemas: SchemaDiff[]
  ) {
    const overallScoreDelta = after.overallScore - before.overallScore;
    const improvement = overallScoreDelta > 0;

    const schemasAdded = schemas.filter((s) => s.changeType === 'added').length;
    const schemasRemoved = schemas.filter(
      (s) => s.changeType === 'removed'
    ).length;
    const schemasModified = schemas.filter(
      (s) => s.changeType === 'modified'
    ).length;
    const schemasUnchanged = schemas.filter(
      (s) => s.changeType === 'unchanged'
    ).length;

    let errorsFixed = 0;
    let errorsNew = 0;
    let warningsFixed = 0;
    let warningsNew = 0;
    let richResultsGained = 0;
    let richResultsLost = 0;

    schemas.forEach((schema) => {
      if (schema.changes.errors) {
        errorsFixed += schema.changes.errors.fixed.length;
        errorsNew += schema.changes.errors.new.length;
      }

      if (schema.changes.warnings) {
        warningsFixed += schema.changes.warnings.fixed.length;
        warningsNew += schema.changes.warnings.new.length;
      }

      if (schema.changes.richResultsEligibility?.improvement) {
        richResultsGained++;
      } else if (
        schema.changes.richResultsEligibility &&
        !schema.changes.richResultsEligibility.improvement &&
        schema.changes.richResultsEligibility.changed
      ) {
        richResultsLost++;
      }
    });

    return {
      overallScoreDelta,
      improvement,
      schemasAdded,
      schemasRemoved,
      schemasModified,
      schemasUnchanged,
      errorsFixed,
      errorsNew,
      warningsFixed,
      warningsNew,
      richResultsGained,
      richResultsLost,
    };
  }

  private generateInsights(
    summary: ComparisonResult['summary'],
    schemas: SchemaDiff[]
  ): ComparisonResult['insights'] {
    const majorImprovements: string[] = [];
    const majorRegressions: string[] = [];
    const recommendations: string[] = [];

    // Overall score insights
    if (summary.overallScoreDelta >= 20) {
      majorImprovements.push(
        `Significant score improvement: +${summary.overallScoreDelta} points`
      );
    } else if (summary.overallScoreDelta <= -20) {
      majorRegressions.push(
        `Significant score decline: ${summary.overallScoreDelta} points`
      );
    }

    // Rich Results insights
    if (summary.richResultsGained > 0) {
      majorImprovements.push(
        `${summary.richResultsGained} schema${summary.richResultsGained > 1 ? 's' : ''} became eligible for Rich Results`
      );
    }

    if (summary.richResultsLost > 0) {
      majorRegressions.push(
        `${summary.richResultsLost} schema${summary.richResultsLost > 1 ? 's' : ''} lost Rich Results eligibility`
      );
      recommendations.push(
        'Review Rich Results requirements and restore missing properties'
      );
    }

    // Error insights
    if (summary.errorsFixed > 0) {
      majorImprovements.push(`Fixed ${summary.errorsFixed} error${summary.errorsFixed > 1 ? 's' : ''}`);
    }

    if (summary.errorsNew > 0) {
      majorRegressions.push(`${summary.errorsNew} new error${summary.errorsNew > 1 ? 's' : ''} introduced`);
      recommendations.push('Address new validation errors immediately');
    }

    // Schema changes insights
    if (summary.schemasAdded > 0) {
      majorImprovements.push(`Added ${summary.schemasAdded} new schema${summary.schemasAdded > 1 ? 's' : ''}`);
    }

    if (summary.schemasRemoved > 0) {
      majorRegressions.push(
        `Removed ${summary.schemasRemoved} schema${summary.schemasRemoved > 1 ? 's' : ''}`
      );
    }

    // Generate recommendations based on schemas
    schemas.forEach((schema) => {
      if (schema.changeType === 'modified' && schema.changes.score) {
        if (schema.changes.score.delta < -10) {
          recommendations.push(
            `${schema.type} score dropped significantly - review recent changes`
          );
        }
      }

      if (schema.changes.errors?.new && schema.changes.errors.new.length > 0) {
        schema.changes.errors.new.forEach((error) => {
          if (!recommendations.includes(`Fix ${error.property} in ${schema.type}`)) {
            recommendations.push(`Fix ${error.property} in ${schema.type}`);
          }
        });
      }
    });

    // If no major changes, add a neutral insight
    if (majorImprovements.length === 0 && majorRegressions.length === 0) {
      if (summary.overallScoreDelta === 0) {
        majorImprovements.push('Schema validation maintained at same level');
      } else if (summary.overallScoreDelta > 0) {
        majorImprovements.push(`Minor improvement: +${summary.overallScoreDelta} points`);
      } else {
        majorRegressions.push(`Minor decline: ${summary.overallScoreDelta} points`);
      }
    }

    return {
      majorImprovements,
      majorRegressions,
      recommendations: recommendations.slice(0, 10), // Limit to top 10 recommendations
    };
  }
}

// Singleton instance
export const diffEngine = new DiffEngine();
