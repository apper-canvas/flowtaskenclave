class FolderService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
  
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "order" } }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords("folder", params);
      
      if (!response.success) {
        console.error("Error fetching folders:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching folders:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching folders:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "order" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById("folder", parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching folder:", response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching folder:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching folder:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  async create(folderData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: folderData.Name || folderData.name,
          Tags: folderData.Tags || folderData.tags || "",
          Owner: folderData.Owner || folderData.owner,
          color: folderData.color,
          icon: folderData.icon,
          order: folderData.order || 0
        }]
      };
      
      const response = await this.apperClient.createRecord("folder", params);
      
      if (!response.success) {
        console.error("Error creating folder:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} folders:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create folder");
        }
        
        return successfulRecords[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating folder:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating folder:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  async update(id, folderData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: folderData.Name || folderData.name,
          Tags: folderData.Tags || folderData.tags || "",
          Owner: folderData.Owner || folderData.owner,
          color: folderData.color,
          icon: folderData.icon,
          order: folderData.order
        }]
      };
      
      const response = await this.apperClient.updateRecord("folder", params);
      
      if (!response.success) {
        console.error("Error updating folder:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} folders:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update folder");
        }
        
        return successfulRecords[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating folder:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating folder:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord("folder", params);
      
      if (!response.success) {
        console.error("Error deleting folder:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} folders:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete folder");
        }
      }
      
      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting folder:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting folder:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export const folderService = new FolderService();