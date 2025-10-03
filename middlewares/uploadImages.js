import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

//file filter

const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const documentTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  const allowedTypes = [...imageTypes, ...documentTypes];
  
  if (allowedTypes.includes(file.mimetype)){
    cb(null, true)
  }
  else{
    cb(new Error("Only JPEG, PNG, JPG images and PDF, DOC, DOCX documents are allowed"), false)
  }
}

const upload = multer({storage, fileFilter})

export default upload