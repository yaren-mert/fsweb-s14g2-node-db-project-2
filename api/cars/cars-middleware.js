const carsModel = require("./cars-model");
const vinValidator = require("vin-validator");
const db = require("../../data/db-config");

const checkCarId = async (req, res, next) => {
  // HOKUS POKUS
  try {
    const isExist = await carsModel.getById(req.params.id);
    if (!isExist) {
      res
        .status(404)
        .json({ message: `${req.params.id} kimliğine sahip araba bulunamadı` });
    } else {
      req.car = isExist;
    }
    next();
  } catch (error) {
    next(error);
  }
};

const checkCarPayload = async (req, res, next) => {
  // HOKUS POKUS
  try {
    const fields = ["vin", "make", "model", "mileage"];
    const missedFields = [];

    fields.forEach((field) => {
      if (!req.body[field]) {
        missedFields.push(field);
      }
    });

    if (missedFields.length > 0) {
      let missedFieldsStr = missedFields.join();
      res.status(400).json({ message: `${missedFieldsStr} is missing` });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkVinNumberValid = (req, res, next) => {
  // HOKUS POKUS
  let isValidVin = vinValidator.validate(req.body.vin);
  if (!isValidVin) {
    res.status(400).json({ message: `vin ${req.body.vin} is invalid` });
  } else {
    next();
  }
};

const checkVinNumberUnique = async (req, res, next) => {
  // HOKUS POKUS
  try {
    let isExist = await db("cars").where("vin", req.body.vin).first(); //Veritabanına sorgu atarak kontrol ettik, tüm datayı for ile dönüp kontrol edebilirdik.
    if (isExist) {
      res.status(400).json({ message: `vin ${req.body.vin} already exists` });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberUnique,
  checkVinNumberValid,
};
