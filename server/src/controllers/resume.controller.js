import { prisma } from "../db/prisma.js";

export const createResume = async (req, res) => {
  try {
    const { title, resumeId, userEmail, userName } = req.body;

    if (!title || !resumeId || !userEmail) {
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
      data: { title, resumeId, userEmail, userName },
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
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userEmail: email,
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

    const resume = await prisma.resume.findUnique({
      where: { resumeId },
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
      firstName, lastName, jobTitle,
      address, phone, email, summary,
      themeColor, experiences, education,
      skills,
    } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const existingResume = await prisma.resume.findUnique({
      where: {
        resumeId,
      },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resume = await prisma.$transaction(async (tx) => {
      const updatedResume = await tx.resume.update({
        where: {
          resumeId,
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
        await tx.experience.deleteMany({
          where: {
            resumeId: existingResume.id,
          },
        });

        if (experiences.length > 0) {
          await tx.experience.createMany({
            data: experiences.map((experience) => ({
              title: experience.title,
              companyName: experience.companyName,
              city: experience.city,
              state: experience.state,
              startDate: experience.startDate,
              endDate: experience.endDate,
              workSummary: experience.workSummary,
              resumeId: existingResume.id,
            })),
          });
        }
      }

      if (education !== undefined) {
        await tx.education.deleteMany({
          where: {
            resumeId: existingResume.id,
          },
        });

        if (education.length > 0) {
          await tx.education.createMany({
            data: education.map((educationItem) => ({
              universityName: educationItem.universityName,
              degree: educationItem.degree,
              major: educationItem.major,
              startDate: educationItem.startDate,
              endDate: educationItem.endDate,
              description: educationItem.description,
              resumeId: existingResume.id,
            })),
          });
        }
      }

      if (skills !== undefined) {
        await tx.skill.deleteMany({
          where: {
            resumeId: existingResume.id,
          },
        });

        if (skills.length > 0) {
          await tx.skill.createMany({
            data: skills.map((skill) => ({
              name: skill.name,
              rating: skill.rating,
              resumeId: existingResume.id,
            })),
          });
        }
      }

      return updatedResume;
    });

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: resume,
    });
  } catch (error) {
    console.error("UPDATE_RESUME_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update resume",
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
    const resume = await prisma.resume.findUnique({
      where: {
        resumeId,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const updatedResume =
      await prisma.$transaction(async (tx) => {
        await tx.skill.deleteMany({
          where: {
            resumeId: resume.id,
          },
        });

        if (skills.length > 0) {
          await tx.skill.createMany({
            data: skills.map((skill) => ({
              name: skill.name,
              rating: skill.rating,
              resumeId: resume.id,
            })),
          });
        }

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
      "UPDATE_SKILLS_ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update skills",
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
    const resume = await prisma.resume.findUnique({
      where: {
        resumeId,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const updatedResume =
      await prisma.$transaction(async (tx) => {
        await tx.experience.deleteMany({
          where: {
            resumeId: resume.id,
          },
        });

        await tx.experience.createMany({
          data: experiences.map((experience) => ({
            ...experience,
            resumeId: resume.id,
          })),
        });

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

    return res.status(500).json({
      success: false,
      message: "Failed to update experiences",
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
    const resume = await prisma.resume.findUnique({
      where: {
        resumeId,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const updatedResume =
      await prisma.$transaction(async (tx) => {
        await tx.education.deleteMany({
          where: {
            resumeId: resume.id,
          },
        });

        if (education.length > 0) {
          await tx.education.createMany({
            data: education.map((item) => ({
              ...item,
              resumeId: resume.id,
            })),
          });
        }

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

    return res.status(500).json({
      success: false,
      message: "Failed to update education",
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
    };

    const resume = await prisma.resume.delete({
      where: { resumeId },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    };

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("GET_RESUME_BY_ID_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
}