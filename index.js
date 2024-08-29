import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
app.use(express.static('public'));
app.use(express.json()); 

const  db = await sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
});
console.log("db initialized");
await db.migrate();

app.post('/api/price_plan_update', async(req, res) => {
    
    try {
        const plan = await db.get("SELECT * FROM price_plan WHERE plan_name = ?", req.body.plan_name);

        if (!plan) {
            return res.status(404).json({ error: `Plan name ${req.body.plan_name} doesn't exist` });
        }

        const { sms_price, call_price, plan_name } = req.body;

        await db.run(`UPDATE price_plan SET sms_price = ?, call_price = ? WHERE plan_name = ?`, 
            sms_price, 
            call_price, 
            plan_name
        );

        res.json({
            status: `Successfully updated the plan ${plan_name}`
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to update price plan' });
    }

});

app.post('/api/phonebill', async(req, res) => {

    try {
        const price_plan_name = req.body.price_plan;


        const price_plan = await db.get(`SELECT id, plan_name, sms_price, call_price
            FROM price_plan WHERE plan_name = ?`, price_plan_name);

        if (!price_plan) {
            return res.status(404).json({
                error: `Invalid price plan name: ${price_plan_name}`
            });
        }

        const activity = req.body.actions;
        const activities = activity.split(",");

   
        let total = 0;

        
        activities.forEach(action => {
            if (action.trim() === 'sms') {
                total += price_plan.sms_price;
            } else if (action.trim() === 'call') {
                total += price_plan.call_price;
            }
        });


        res.json({
            total: `R${total.toFixed(2)}`
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch price plans' });
    }
});

app.post('/api/price_plan/create', async (req, res) => {
    try {
        const existingPlan = await db.get("SELECT * FROM price_plan WHERE plan_name = ?", req.body.plan_name);
        if (existingPlan) {
            return res.status(400).json({
                error: "Price plan already exists."
            });
        }

        await db.run("INSERT INTO price_plan (plan_name, sms_price, call_price) VALUES (?, ?, ?);",
            req.body.plan_name,
            req.body.sms_price,
            req.body.call_price
        );

        res.json({
            status: `Successfully created the ${req.body.plan_name} plan`
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to create price plan' });
    }
});



app.get('/api/price_plan', async(req, res) => {

    const price_plans = await db.all(`SELECT * FROM price_plan`);

    res.json({
        price_plans
    })
});

app.post('/api/price_plan/delete', async (req, res) => {
    try {
        const found = await db.get("SELECT * FROM price_plan WHERE plan_name = ?", req.body.plan_name);

        if (found) {
            await db.run("DELETE FROM price_plan WHERE plan_name = ?", req.body.plan_name);

            res.json({
                status: `Successfully deleted the ${req.body.plan_name} plan`
            });
        } else {
            res.status(404).json({
                error: `Price plan ${req.body.plan_name} doesn't exist`
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete price plan' });
    }
});





const PORT = process.env.PORT || 7001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))