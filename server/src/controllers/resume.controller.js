import { prisma } from "../db/prisma.js";

const getOwnedResumeOrThrow = async (resumeId, clerkUserId) => {
  const resume = await prisma.resume.findFirst({
    where: {
      resumeId,
      clerkUserId,
    },
  });

  if (!resume) {
    const error = new Error("Resume not found");
    error.statusCode = 404;
    throw error;
  }

  return resume;
};

const replaceChildRecords = async (
  tx,
  model,
  resumeId,
  items,
  mapper
) => {
  await tx[model].deleteMany({
    where: {
      resumeId,
    },
  });

  if (items.length > 0) {
    await tx[model].createMany({
      data: items.map((item) => mapper(item, resumeId)),
    });
  }
};

export const createResume = async (req, res) => {
  try {
    const { userId } = req;    
    const { title, resumeId } = req.body;

    if (!title || !resumeId ) {
      return res.status(400).json({
        success: false,
        message: "title, resumeId and userEmail are required",
      });
    };

    const existingResume = await prisma.resume.findUnique({
      where: {
        resumeId,
      },
    });

    if (existingResume) {
      return res.status(409).json({
        success: false,
        message: "Resume already exists",
      });
    }

    const resume = await prisma.resume.create({
      data: { title, resumeId, clerkUserId: userId, },
    });

    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: resume,
    });
  } catch (error) {
    console.error("CREATE_RESUME_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create resume",
    });
  }
};

export const getUserResumes = async (req, res) => {
  try {
     const { userId } = req;

    const resumes = await prisma.resume.findMany({
      where: {
        clerkUserId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    console.error("GET_USER_RESUMES_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user resumes",
    });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const resume = await prisma.resume.findFirst({
      where: { resumeId, clerkUserId: req.userId, },
      include: {
        experiences: {
          orderBy: { createdAt: "asc" },
        },
        education: {
          orderBy: {createdAt: "asc" },
        },
        skills: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("GET_RESUME_BY_ID_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const {
      firstName, lastName, jobTitle, address,
      phone, email, summary, themeColor,
      experiences, education, skills,
    } = req.body;

    const existingResume = await getOwnedResumeOrThrow(
      resumeId,
      req.userId
    );

    const resume = await prisma.$transaction(async (tx) => {
      await tx.resume.update({
        where: {
          id: existingResume.id,
        },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(jobTitle !== undefined && { jobTitle }),
          ...(address !== undefined && { address }),
          ...(phone !== undefined && { phone }),
          ...(email !== undefined && { email }),
          ...(summary !== undefined && { summary }),
          ...(themeColor !== undefined && { themeColor }),
        },
      });

      if (experiences !== undefined) {
        await replaceChildRecords(
          tx,
          "experience",
          existingResume.id,
          experiences,
          (experience, resumeId) => ({
            title: experience.title,
            companyName: experience.companyName,
            city: experience.city,
            state: experience.state,
            startDate: experience.startDate,
            endDate: experience.endDate,
            workSummary: experience.workSummary,
            resumeId,
          })
        );
      }

      if (education !== undefined) {
        await replaceChildRecords(
          tx,
          "education",
          existingResume.id,
          education,
          (educationItem, resumeId) => ({
            universityName: educationItem.universityName,
            degree: educationItem.degree,
            major: educationItem.major,
            startDate: educationItem.startDate,
            endDate: educationItem.endDate,
            description: educationItem.description,
            resumeId,
          })
        );
      }

      if (skills !== undefined) {
        await replaceChildRecords(
          tx,
          "skill",
          existingResume.id,
          skills,
          (skill, resumeId) => ({
            name: skill.name,
            rating: skill.rating,
            resumeId,
          })
        );
      }

      return tx.resume.findUnique({
        where: {
          id: existingResume.id,
        },
        include: {
          experiences: true,
          education: true,
          skills: true,
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: resume,
    });
  } catch (error) {
    console.error("UPDATE_RESUME_ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 404
          ? error.message
          : "Failed to update resume",
    });
  }
};

export const updateSkills = async (req, res) => {
  const { resumeId } = req.params;
  const { skills } = req.body;

  if (!Array.isArray(skills)) {
    return res.status(400).json({
      success: false,
      message: "Skills must be an array",
    });
  }

  try {
    const resume = await getOwnedResumeOrThrow(
      resumeId,
      req.userId
    );

    const updatedResume = await prisma.$transaction(async (tx) => {
      await replaceChildRecords(
        tx,
        "skill",
        resume.id,
        skills,
        (skill, resumeId) => ({
          name: skill.name,
          rating: skill.rating,
          resumeId,
        })
      );

      return tx.resume.findUnique({
        where: {
          id: resume.id,
        },
        include: {
          experiences: true,
          education: true,
          skills: true,
        },
      });
    });

    return res.status(200).json({
      success: true,
      data: updatedResume,
    });
  } catch (error) {
    console.error("UPDATE_SKILLS_ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 404
          ? error.message
          : "Failed to update skills",
    });
  }
};

export const updateEducation = async (req, res) => {
  const { resumeId } = req.params;
  const { education } = req.body;

  if (!Array.isArray(education)) {
    return res.status(400).json({
      success: false,
      message: "Education must be an array",
    });
  }

  try {
    const resume = await getOwnedResumeOrThrow(
      resumeId,
      req.userId
    );

    const updatedResume = await prisma.$transaction(async (tx) => {
      await replaceChildRecords(
        tx,
        "education",
        resume.id,
        education,
        (educationItem, resumeId) => ({
          universityName: educationItem.universityName,
          degree: educationItem.degree,
          major: educationItem.major,
          startDate: educationItem.startDate,
          endDate: educationItem.endDate,
          description: educationItem.description,
          resumeId,
        })
      );

      return tx.resume.findUnique({
        where: {
          id: resume.id,
        },
        include: {
          experiences: true,
          education: true,
          skills: true,
        },
      });
    });

    return res.status(200).json({
      success: true,
      data: updatedResume,
    });
  } catch (error) {
    console.error(
      "UPDATE_EDUCATION_ERROR:",
      error
    );

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 404
          ? error.message
          : "Failed to update education",
    });
  }
};

export const updateExperiences = async (req, res) => {
  const { resumeId } = req.params;
  const { experiences } = req.body;

  if (!Array.isArray(experiences)) {
    return res.status(400).json({
      success: false,
      message: "Experiences must be an array",
    });
  }

  try {
    const resume = await getOwnedResumeOrThrow(
      resumeId,
      req.userId
    );

    const updatedResume = await prisma.$transaction(async (tx) => {
      await replaceChildRecords(
        tx,
        "experience",
        resume.id,
        experiences,
        (experience, resumeId) => ({
          title: experience.title,
          companyName: experience.companyName,
          city: experience.city,
          state: experience.state,
          startDate: experience.startDate,
          endDate: experience.endDate,
          workSummary: experience.workSummary,
          resumeId,
        })
      );

      return tx.resume.findUnique({
        where: {
          id: resume.id,
        },
        include: {
          experiences: true,
          education: true,
          skills: true,
        },
      });
    });

    return res.status(200).json({
      success: true,
      data: updatedResume,
    });
  } catch (error) {
    console.error(
      "UPDATE_EXPERIENCES_ERROR:",
      error
    );

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 404
          ? error.message
          : "Failed to update experiences",
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const resume = await prisma.resume.findFirst({
      where: {
        resumeId,
        clerkUserId: req.userId,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    await prisma.resume.delete({
      where: {
        id: resume.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_RESUME_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};