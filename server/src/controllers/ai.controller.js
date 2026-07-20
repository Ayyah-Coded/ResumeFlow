import { generateResumeSummaries } from "../services/gemini.service.js";
import { reserveAiUsage, refundAiUsage, getAiUsage } from "../services/ai-usage.service.js";

export const generateSummary = async ( req, res ) => {
  const userId = req.userId;

  let usageReservation = null;

  try {
    const { jobTitle } = req.body;

    if (!jobTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title is required",
      });
    }

    usageReservation = await reserveAiUsage(
      userId
    );

    const summaries =
      await generateResumeSummaries(
        jobTitle.trim()
      );

    const usage = await getAiUsage(userId);

    return res.status(200).json({
      success: true,
      data: summaries,
      usage,
    });
  } catch (error) {
    console.error(
      "GENERATE_SUMMARY_ERROR:",
      error
    );

    if (
      usageReservation &&
      error.statusCode !== 429
    ) {
      await refundAiUsage(
        userId,
        usageReservation.usageDate
      );
    }

    if (error.statusCode === 429) {
      return res.status(429).json({
        success: false,
        message:
          "Daily AI generation limit reached. Please try again tomorrow.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate resume summaries",
    });
  };
};

export const getAiUsageStatus = async ( req, res ) => {
  try {
    const usage = await getAiUsage(
      req.userId
    );

    return res.status(200).json({
      success: true,
      data: usage,
    });
  } catch (error) {
    console.error(
      "GET_AI_USAGE_ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get AI usage",
    });
  };
};