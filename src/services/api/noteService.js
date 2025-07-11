class NoteService {
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
          { field: { Name: "content" } },
          { field: { Name: "folderId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords("note", params);
      
      if (!response.success) {
        console.error("Error fetching notes:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching notes:", error.message);
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
          { field: { Name: "content" } },
          { field: { Name: "folderId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById("note", parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching note:", response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching note:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching note:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  async create(noteData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: noteData.Name || noteData.title,
          Tags: noteData.Tags || noteData.tags || "",
          Owner: noteData.Owner || noteData.owner,
          title: noteData.title,
          content: noteData.content || "",
          folderId: noteData.folderId ? parseInt(noteData.folderId) : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord("note", params);
      
      if (!response.success) {
        console.error("Error creating note:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} notes:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create note");
        }
        
        return successfulRecords[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating note:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating note:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  async update(id, noteData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: noteData.Name || noteData.title,
          Tags: noteData.Tags || noteData.tags || "",
          Owner: noteData.Owner || noteData.owner,
          title: noteData.title,
          content: noteData.content || "",
          folderId: noteData.folderId ? parseInt(noteData.folderId) : null,
          updatedAt: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord("note", params);
      
      if (!response.success) {
        console.error("Error updating note:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} notes:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update note");
        }
        
        return successfulRecords[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating note:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating note:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord("note", params);
      
      if (!response.success) {
        console.error("Error deleting note:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} notes:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete note");
        }
      }
      
      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting note:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting note:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export const noteService = new NoteService();