// const http = require('http')

// const server = http.createServer((req,res)=>{
//     res.end("Maha")
// })

// const PORT = 1000;

// server.listen(PORT,()=>{
//     console.log(`my server run on http://localhost:${PORT}`)
// })

// const express = require("express");

// const app = express();

// const students = [
//     { id: 1, name: "a" },
//     { id: 2, name: "b" }
// ];

// app.get("/", (req, res) => {
//     res.json(students);
// });

// app.get("/params/:id", (req, res) => {
//     const { id } = req.params;
//     const result = students.find((item) => item.id === Number(id));
//     if (result) {
//         res.json(result);
//     } else {
//         res.status(404).json({ message: "Student not found" });
//     }
// });

// app.get("/Queryparams", (req, res) => {
//     const { name } = req.query;
//     if (name) {
//         const result = students.find((item) => item.name.toLowerCase() === name.toLowerCase());
//         if (result) {
//             res.json(result);
//         } else {
//             res.status(404).json({ message: "Student not found" });
//         }
//     } else {
//         res.status(400).json({ message: "Name query parameter is required" });
//     }
// });

// const PORT = 1000;

// app.listen(PORT, () => {
//     console.log(`My server runs on http://localhost:${PORT}`);
// });



const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json()); 

const PORT = 8000;

// MongoDB connection
const mongourl = "mongodb+srv://mahaveer:mahaveer$310@cluster0.3fzbv.mongodb.net/Practice";
mongoose
  .connect(mongourl)
  .then(() => {
    console.log("DB Connected");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 }, 
});

const Expense = mongoose.model("expense-tracker", expenseSchema);


app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title and Amount are required" });
    }

    const newExpense = new Expense({
      id: uuidv4(),
      title: title,
      amount: amount,
    });

    const savedExpense = await newExpense.save();
    res.status(200).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/expensesbyId/:id", async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findOne({ id });

    if (expense) {
        res.status(200).json(expense);
    }
});

app.put("/api/expensesUpdate/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
      { id },
      updates,
      { new: true }
    );

    if (updatedExpense) {
        res.status(200).json(updatedExpense);
    }
});


app.delete("/api/expensesdeletebyId/:id", async (req, res) => {
    const { id } = req.params;
      const result = await Expense.deleteOne({ id });
  
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Expense not found" });
      }
  });

  app.delete("/api/expensesdeleteAll", async (req, res) => {
      const result = await Expense.deleteMany({});
  
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Expense not found" });
      }
  });