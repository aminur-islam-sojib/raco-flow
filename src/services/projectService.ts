import { collections, dbConnect } from "@/lib/dbConnects";

export async function createNewProject(data: any) {
  const projectsCollection = dbConnect(collections.PROJECTS);

  const project = {
    ...data,
    status: "OPEN",
    applicants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await projectsCollection.insertOne(project);
  return { ...project, _id: result.insertedId };
}

export async function getMarketplaceProjects() {
  const projectsCollection = dbConnect(collections.PROJECTS);

  return await projectsCollection.find({}).toArray();
}
