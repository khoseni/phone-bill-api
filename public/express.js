document.addEventListener('alpine:init', () => {

    Alpine.data('totalphonebillWidget', () => {
      return {
        plan: '',
        usage: '',
        new_plan_name: '',
        new_sms_price: '',
        new_call_price: '',
        pricePlans: [],
        updatePlanName: '',
        updateSMSPrice: '',
        updateCallPrice: '',
        deletePlanName: '',
        billMessage: '',
        showTable: true,
        showFirstSection: false,
  
        init() {
          axios.get('/api/price_plan')
            .then(response => {
              this.pricePlans = response.data.price_plans; 
            })
            .catch(error => {
              console.error("Failed to fetch data from /api/price_plan");
            });
        },
  
        calculateBill() {
          axios.post('/api/phonebill', {
            price_plan: this.plan.toLowerCase(),
            actions: this.usage.toLowerCase()
          })
          .then(response => {
            if (response.data.error) {
              alert(response.data.error);
            } else {
              this.billMessage = response.data.total;
              setTimeout(() => {
                this.resetBillData();
              }, 5000);
            }
          });
        },
  
        createPlan() {
          axios.post("/api/price_plan/create", {
            plan_name: this.new_plan_name.toLowerCase(),
            sms_price: parseFloat(this.new_sms_price).toFixed(2),
            call_price: parseFloat(this.new_call_price).toFixed(2)
          })
          .then(response => {
            if (response.data.error) {
              alert(response.data.error);
              this.resetNewPlanData();
            } else {
              alert(response.data.status);
              location.reload();
              this.resetNewPlanData();
            }
          });
        },
  
        updatePlan() {
          axios.post("/api/price_plan_update", {
            plan_name: this.updatePlanName.toLowerCase(),
            sms_price: parseFloat(this.updateSMSPrice).toFixed(2),
            call_price: parseFloat(this.updateCallPrice).toFixed(2)
          })
          .then(response => {
            if (response.data.status) {
              alert(response.data.status);
              location.reload();
              this.resetUpdatePlanData();
            } else {
              alert(response.data.error);
              this.resetUpdatePlanData();
            }
          });
        },
  
        deletePlan() {
          axios.post("/api/price_plan/delete", {
            plan_name: this.deletePlanName.toLowerCase()
          })
          .then(response => {
            if (response.data.status) {
              alert(response.data.status);
              location.reload();
              this.resetDeletePlanData();
            } else {
              alert(response.data.error);
              this.resetDeletePlanData();
            }
          });
        },
  
        resetBillData() {
          this.billMessage = '';
          this.plan = '';
          this.usage = '';
        },
  
        resetNewPlanData() {
          this.new_plan_name = '';
          this.new_sms_price = '';
          this.new_call_price = '';
        },
  
        resetUpdatePlanData() {
          this.updatePlanName = '';
          this.updateSMSPrice = '';
          this.updateCallPrice = '';
        },
  
        resetDeletePlanData() {
          this.deletePlanName = '';
        }
      };
    });
  });
  