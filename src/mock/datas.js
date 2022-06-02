const whoAmI = {
  id: "Myself",
  icon: '👾',
  role: "Contributor",
};

const peoples = new Set([
  {
    id: "Myself",
    icon: '👾',
    role: "Contributor",
  },
  {
    id: "God",
    icon: '☀️',
    role: "Administrator",
  },
  {
    id: "JCVD",
    icon: '💂‍♂️',
    role: "Owner",
  },
  {
    id: "John Papa",
    icon: '👨',
    role: "Contributor",
  },
  {
    id: "Devil Daughter",
    icon: '👧',
    role: "Reader",
  },
]);

const roles = new Set([
  "Administrator",
  "Owner",
  "Contributor",
  "Reader",
]);

const TaskPriorities = new Set(["Low", "High", "Top"]);

const privateFields = new Set([""]);

const obfuscatedFields = new Set(["creditCard"]);

export {
  obfuscatedFields,
  peoples,
  privateFields,
  TaskPriorities,
  roles,
  whoAmI,
};
