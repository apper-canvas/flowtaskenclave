class TaskService {
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "folderId" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords("task", params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching tasks:", error.message);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "folderId" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById("task", parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching task:", response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching task:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching task:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  async create(taskData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: taskData.Name || taskData.title,
          Tags: taskData.Tags || taskData.tags || "",
          Owner: taskData.Owner || taskData.owner,
          title: taskData.title,
          description: taskData.description || "",
          status: taskData.status || "todo",
          priority: taskData.priority || "medium",
          dueDate: taskData.dueDate || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          folderId: taskData.folderId ? parseInt(taskData.folderId) : null
        }]
      };
      
      const response = await this.apperClient.createRecord("task", params);
      
      if (!response.success) {
        console.error("Error creating task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create task");
        }
        
        return successfulRecords[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating task:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  async update(id, taskData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.Name || taskData.title,
          Tags: taskData.Tags || taskData.tags || "",
          Owner: taskData.Owner || taskData.owner,
          title: taskData.title,
          description: taskData.description || "",
          status: taskData.status,
          priority: taskData.priority,
          dueDate: taskData.dueDate || null,
          updatedAt: new Date().toISOString(),
          folderId: taskData.folderId ? parseInt(taskData.folderId) : null
        }]
      };
      
      const response = await this.apperClient.updateRecord("task", params);
      
      if (!response.success) {
        console.error("Error updating task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update task");
        }
        
        return successfulRecords[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating task:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord("task", params);
      
      if (!response.success) {
        console.error("Error deleting task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete task");
        }
      }
      
      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting task:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export const taskService = new TaskService();