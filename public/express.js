document.addEventListener('alpine:init', () => {
  Alpine.data('totalphonebillWidget', () => ({
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

      async init() {
          try {
              const response = await axios.get('/api/price_plan');
              this.pricePlans = response.data.price_plans;
          } catch (error) {
              console.error("Failed to fetch data from /api/price_plan");
          }
      },

      async calculateBill() {
          try {
              const response = await axios.post('/api/phonebill', {
                  price_plan: this.plan.toLowerCase(),
                  actions: this.usage.toLowerCase()
              });
              if (response.data.error) {
                  alert(response.data.error);
              } else {
                  this.billMessage = response.data.total;
                  setTimeout(() => {
                      this.resetBillData();
                  }, 5000);
              }
          } catch (error) {
              console.error('Failed to calculate bill.');
          }
      },

      async createPlan() {
          try {
              const response = await axios.post('/api/price_plan/create', {
                  plan_name: this.new_plan_name.toLowerCase(),
                  sms_price: parseFloat(this.new_sms_price).toFixed(2),
                  call_price: parseFloat(this.new_call_price).toFixed(2)
              });
              if (response.data.error) {
                  alert(response.data.error);
                  this.resetNewPlanData();
              } else {
                  alert(response.data.status);
                  await this.init(); // Refresh the price plans
                  this.resetNewPlanData();
              }
          } catch (error) {
              console.error('Failed to create plan.');
          }
      },

      async updatePlan() {
          try {
              const response = await axios.post('/api/price_plan_update', {
                  plan_name: this.updatePlanName.toLowerCase(),
                  sms_price: parseFloat(this.updateSMSPrice).toFixed(2),
                  call_price: parseFloat(this.updateCallPrice).toFixed(2)
              });
              if (response.data.status) {
                  alert(response.data.status);
                  await this.init(); // Refresh the price plans
                  this.resetUpdatePlanData();
              } else {
                  alert(response.data.error);
                  this.resetUpdatePlanData();
              }
          } catch (error) {
              console.error('Failed to update plan.');
          }
      },

      async deletePlan() {
          try {
              const response = await axios.post('/api/price_plan/delete', {
                  plan_name: this.deletePlanName.toLowerCase()
              });
              if (response.data.status) {
                  alert(response.data.status);
                  await this.init(); // Refresh the price plans
                  this.resetDeletePlanData();
              } else {
                  alert(response.data.error);
                  this.resetDeletePlanData();
              }
          } catch (error) {
              console.error('Failed to delete plan.');
          }
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
  }));
});
