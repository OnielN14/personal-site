import featureFlag from "../../feature.json";

export const isProjectsEnabled = async () => {
    return featureFlag.projects;
};

export const isNotesEnabled = async () => {
    return featureFlag.notes;
};
