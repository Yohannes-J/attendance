import School from "../models/schoolModel.js";

export const addSchool = async (req, res) => {
  try {
    const { school } = req.body;

    const newSchool = new School({ school });
    await newSchool.save();

    res
      .status(201)
      .json({ message: "School added successfully", data: newSchool });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
