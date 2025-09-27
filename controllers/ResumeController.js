import Resume from "../models/ResumeModel.js";
import fs from "fs";
import path from "path";

// Default template data
const getDefaultTemplate = () => ({
  template: {
    theme: "modern",
    colorPalate: ["#2563eb", "#1e40af", "#3b82f6"],
  },
  profileInfo: {
    profilePreviewUrl: "",
    fullName: "",
    designation: "",
    summary:
      "Passionate professional with expertise in delivering high-quality solutions and driving innovation.",
  },
  contactInfo: {
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
  },
  workExperience: [
    {
      company: "Company Name",
      role: "Job Title",
      startDate: "MM/YYYY",
      endDate: "MM/YYYY",
      description:
        "• Describe your key responsibilities and achievements\n• Use bullet points to highlight your contributions\n• Include quantifiable results when possible",
    },
  ],
  education: [
    {
      degree: "Degree Name",
      institution: "Institution Name",
      startDate: "MM/YYYY",
      endDate: "MM/YYYY",
    },
  ],
  skills: [
    {
      name: "JavaScript",
      progress: 85,
    },
    {
      name: "React",
      progress: 80,
    },
    {
      name: "Node.js",
      progress: 75,
    },
  ],
  projects: [
    {
      title: "Project Name",
      description:
        "Brief description of the project, technologies used, and your role in its development.",
      github: "",
      liveDemo: "",
    },
  ],
  certifications: [
    {
      title: "Certification Name",
      issue: "Issuing Organization",
      year: "YYYY",
    },
  ],
  languages: [
    {
      name: "English",
      progress: 100,
    },
    {
      name: "Spanish",
      progress: 70,
    },
  ],
  interests: ["Technology", "Reading", "Travel", "Photography"],
});

// Create a new resume
export const createResume = async (req, res) => {
  try {
    const { title } = req.body;
    const userID = req.user.id; // Assuming user ID comes from auth middleware

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Resume title is required",
      });
    }

    // Create resume with default template
    const defaultData = getDefaultTemplate();
    const resumeData = {
      userID,
      title,
      thumbnailLink: "",
      ...defaultData,
    };

    const newResume = new Resume(resumeData);
    const savedResume = await newResume.save();

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: savedResume,
    });
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all resumes for a user
export const getUserResumes = async (req, res) => {
  try {
    const userID = req.user.id;

    const resumes = await Resume.find({ userID })
      .select("title thumbnailLink createdAt updatedAt")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: "Resumes retrieved successfully",
      data: resumes,
      count: resumes.length,
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a specific resume by ID
export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.id;

    const resume = await Resume.findOne({ _id: id, userID });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume retrieved successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update a resume
export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.id;
    const updateData = req.body;

    // Remove userID from update data to prevent modification
    delete updateData.userID;

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: id, userID },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: updatedResume,
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete a resume
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.id;

    // First, find the resume to get file paths before deletion
    const resumeToDelete = await Resume.findOne({ _id: id, userID });

    if (!resumeToDelete) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Create uploads folder path
    const uploadsFolder = path.join(process.cwd(), "uploads");

    // Delete associated files before deleting the resume
    try {
      // Delete thumbnail file if exists
      if (resumeToDelete.thumbnailLink) {
        const thumbnailPath = path.join(uploadsFolder, path.basename(resumeToDelete.thumbnailLink));
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
          console.log(`Deleted thumbnail: ${thumbnailPath}`);
        }
      }

      // Delete profile image if exists
      if (resumeToDelete.profileInfo?.profilePreviewUrl) {
        const profilePath = path.join(uploadsFolder, path.basename(resumeToDelete.profileInfo.profilePreviewUrl));
        if (fs.existsSync(profilePath)) {
          fs.unlinkSync(profilePath);
          console.log(`Deleted profile image: ${profilePath}`);
        }
      }

      // Delete any other resume-related documents
      // You can add more file cleanup logic here if needed
      
    } catch (fileError) {
      console.error("Error deleting associated files:", fileError);
      // Continue with resume deletion even if file cleanup fails
    }

    // Now delete the resume from database
    const deletedResume = await Resume.findOneAndDelete({ _id: id, userID });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Resume and associated files deleted successfully",
      data: deletedResume,
    });

  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Duplicate a resume
export const duplicateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.id;

    const originalResume = await Resume.findOne({ _id: id, userID });

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Create a copy with a new title
    const resumeCopy = originalResume.toObject();
    delete resumeCopy._id;
    delete resumeCopy.createdAt;
    delete resumeCopy.updatedAt;
    resumeCopy.title = `${originalResume.title} (Copy)`;

    const newResume = new Resume(resumeCopy);
    const savedResume = await newResume.save();

    res.status(201).json({
      success: true,
      message: "Resume duplicated successfully",
      data: savedResume,
    });
  } catch (error) {
    console.error("Error duplicating resume:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
