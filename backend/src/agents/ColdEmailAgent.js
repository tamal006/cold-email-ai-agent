import { EmailGeneratorTool } from "../tools/EmailGeneratorTool.js";
import { EmailValidatorTool } from "../tools/EmailValidatorTool.js";
import { SubjectOptimizerTool } from "../tools/SubjectOptimizerTool.js";
export class ColdEmailAgent {
  generator;
  validator;
  subjectOptimizer;
  constructor() {
    this.generator = new EmailGeneratorTool();
    this.validator = new EmailValidatorTool();
    this.subjectOptimizer = new SubjectOptimizerTool();
  }
  async run(input) {
    console.log("\u{1F916} Agent: Starting email generation pipeline...");
    console.log(`\u{1F4E7} Purpose: ${input.purpose}`);
    console.log(`\u{1F3AF} Tone: ${input.tone}`);
    const maxAttempts = 3;
    let attempts = 0;
    let bestResult = null;
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`
\u{1F4DD} Agent: Attempt ${attempts}/${maxAttempts}`);
      console.log("  \u2192 Generating email...");
      const generated = await this.generator.generate(input);
      console.log(`  \u2705 Generated: "${generated.subject}"`);
      console.log("  \u2192 Validating quality...");
      const validation = await this.validator.validate(generated.subject, generated.content);
      console.log(`  \u{1F4CA} Quality Score: ${validation.score}/100`);
      const result = {
        subject: generated.subject,
        content: generated.content,
        htmlContent: generated.htmlContent,
        qualityScore: validation.score,
        validationDetails: {
          grammar: validation.grammar,
          readability: validation.readability,
          professionalism: validation.professionalism,
          spamScore: validation.spamScore,
          lengthScore: validation.lengthScore
        },
        suggestions: validation.suggestions,
        alternativeSubjects: [],
        attempts
      };
      if (!bestResult || result.qualityScore > bestResult.qualityScore) {
        bestResult = result;
      }
      if (validation.passesQuality) {
        console.log("  \u2705 Quality check passed!");
        break;
      } else {
        console.log(`  \u26A0\uFE0F Quality below threshold (${validation.score}/100). ${attempts < maxAttempts ? "Regenerating..." : "Using best attempt."}`);
      }
    }
    if (!bestResult) {
      throw new Error("Failed to generate email after maximum attempts");
    }
    console.log("\n\u{1F4CC} Agent: Generating alternative subject lines...");
    try {
      bestResult.alternativeSubjects = await this.subjectOptimizer.optimize(
        bestResult.subject,
        bestResult.content,
        input.purpose
      );
      console.log(`  \u2705 Generated ${bestResult.alternativeSubjects.length} alternatives`);
    } catch (error) {
      console.error("  \u26A0\uFE0F Subject optimization failed, continuing without alternatives");
      bestResult.alternativeSubjects = [];
    }
    console.log("\n\u{1F389} Agent: Email generation pipeline complete!");
    return bestResult;
  }
  async generateVariations(input) {
    console.log("\u{1F916} Agent: Generating email variations...");
    const [formal, friendly, startup] = await Promise.all([
      this.generator.generate({ ...input, tone: "formal" }),
      this.generator.generate({ ...input, tone: "friendly" }),
      this.generator.generate({ ...input, tone: "startup" })
    ]);
    return { formal, friendly, startup };
  }
}
