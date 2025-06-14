import type { CompanyStoreType } from "~/types/companyType";

const LOCAL_KEY = "company_store";
export const useCompanyStore = defineStore("company", {
  state: (): CompanyStoreType => ({
    id: 0,
    name: "",
    code: "",
  }),
  actions: {
      setCompanyStore(company: CompanyStoreType) {
        this.id = company.id;
        this.name = company.name;
        this.code = company.code;
        if (import.meta.client) {
          localStorage.setItem(LOCAL_KEY, JSON.stringify(company))
        }
      },
      loadCompanyStore() {
        if (import.meta.client) {
          const saved = localStorage.getItem(LOCAL_KEY)
          if (saved) {
            const company = JSON.parse(saved)
            this.setCompanyStore(company)
          } else {
              navigateTo('/room-work')
          }
        }
      },
      resetCompanyStore() {
        this.id = 0;
        this.name = "";
        this.code = "";
        if (import.meta.client) {
          localStorage.removeItem(LOCAL_KEY)
        }
      },
    },
})