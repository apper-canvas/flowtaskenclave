import mockFolders from "@/services/mockData/folders.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FolderService {
  constructor() {
    this.folders = [...mockFolders];
  }
  
  async getAll() {
    await delay(200);
    return [...this.folders];
  }
  
  async getById(id) {
    await delay(200);
    const folder = this.folders.find(f => f.Id === parseInt(id));
    if (!folder) {
      throw new Error("Folder not found");
    }
    return { ...folder };
  }
  
  async create(folderData) {
    await delay(300);
    const newFolder = {
      ...folderData,
      Id: Math.max(...this.folders.map(f => f.Id), 0) + 1,
      order: this.folders.length,
    };
    this.folders.push(newFolder);
    return { ...newFolder };
  }
  
  async update(id, folderData) {
    await delay(300);
    const index = this.folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Folder not found");
    }
    
    const updatedFolder = {
      ...this.folders[index],
      ...folderData,
      Id: parseInt(id),
    };
    
    this.folders[index] = updatedFolder;
    return { ...updatedFolder };
  }
  
  async delete(id) {
    await delay(250);
    const index = this.folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Folder not found");
    }
    
    this.folders.splice(index, 1);
    return { success: true };
  }
}

export const folderService = new FolderService();