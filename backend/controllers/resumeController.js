import Resume from '../models/resumeModel.js'
import fs from 'fs'
import path from 'path';

export const createResume = async(req, res)=>{
    try {
        const {title} = req.body;

        //Default templates:
         const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };


        const newResume = await Resume.create({
            userID: req.user._id,
            title,
            ...defaultResumeData,
            ...req.body 
        })
        res.status(201).json(newResume)

    } 
     
    catch (error) {
         res.status(500).json({message: "Failled to create resume", error: error.message})
    }
} 


//GET FUNCION:
export const getUserResumes = async (req, res) => {
    try{
        const resumes = await Resume.find({userID: req.user._id}).sort({
            updatedAt: -1
        });
        res.json(resumes)
    }

    catch (error) {
         res.status(500).json({message: "Failled to get resumes", error: error.message})
    }
} 

//GET RESUME BY ID:

export const getResumeById = async(req, res)=> {
  try{
    const resume = await Resume.findOne({_id: req.params.id, userID: req.user._id })
    if(!resume){
      return res.status(404).json({message: "Resume not found"})
    }
    res.json(resume)
  }
  catch(error){
    res.status(500).json({ message: "Failed to get resume", error: error.message})
  }
}

// UPDATE RESUME:
export  const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userID: req.user._id
    })
    if (!resume){
      return res.status(404).json({ message: "Resume not found or user not authorized" })
    }
    
    // Merge updated resumes
    Object.assign(resume, req.body)
    // Save updated resume
    const savedResume = await resume.save();
    res.json(savedResume)
    
  }
  catch(error){
    res.status(500).json({ message: "Failed to update resumes", error: error.message})
  }
}
// DELETE RESUME:
export const deleteResume  = async(req, res) =>{
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userID: req.user._id})

         if (!resume) {
            return res.status(404).json({message: "Resume not found or not autherised"})
        }
        // Creating an uplaods forlder and storing the resume there 
        const uplaodsFolder = path.join(process.cwd(), 'uploads')
        
        //Delete thumbnail function
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uplaodsFolder, path.basename(resume.thumbnailLink))
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail)
            }
        }

        if (resume.profileInfo.profilePreviewUrl) {
            const oldProfile = path.json(
                uplaodsFolder,
                path.basename(resume.profileInfo.profilePreviewUrl)
            )
            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile)
            }
        }


        //Deleting the resume document
        const deleted = await Resume.findOneAndDelete({
                 _id: req.params.id,
            userID: req.user._id
        })
        if (!deleted) {
            return res.status(404).json({ message: "Resume not found or user not autherized"})
        }
        res.json({ message: "Resume deleted successfully"})
    }
    catch(error){
         res.status(500).json({ messa: "Failed to delete resumes", error: error.message})
    }
    
}