// mobx
import { action, observable, runInAction, makeAutoObservable } from "mobx";
// services
import customAttributesService from "services/custom-attributes.service";
// types
import type { ICustomAttribute } from "types";

class CustomAttributesStore {
  entities: ICustomAttribute[] | null = null;
  entityAttributes: {
    [key: string]: { [key: string]: ICustomAttribute };
  } = {};
  // loaders
  fetchEntitiesLoader = false;
  fetchEntityDetailsLoader = false;
  createEntityAttributeLoader = false;
  createAttributeOptionLoader = false;
  // errors
  attributesFetchError: any | null = null;
  error: any | null = null;
  rootStore: any | null = null;

  constructor(_rootStore: any | null = null) {
    makeAutoObservable(this, {
      entities: observable.ref,
      entityAttributes: observable.ref,
      fetchEntities: action,
      fetchEntityDetails: action,
      createEntity: action,
      deleteEntity: action,
      createEntityAttribute: action,
      updateEntityAttribute: action,
      deleteEntityAttribute: action,
      createAttributeOption: action,
      updateAttributeOption: action,
      deleteAttributeOption: action,
    });

    this.rootStore = _rootStore;
  }

  fetchEntities = async (workspaceSlug: string, projectId: string) => {
    try {
      runInAction(() => {
        this.fetchEntitiesLoader = true;
      });

      const response = await customAttributesService.getEntitiesList(workspaceSlug, {
        project: projectId,
      });

      if (response) {
        runInAction(() => {
          this.entities = response;
          this.fetchEntitiesLoader = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.fetchEntitiesLoader = false;
        this.attributesFetchError = error;
      });
    }
  };

  fetchEntityDetails = async (workspaceSlug: string, propertyId: string) => {
    try {
      runInAction(() => {
        this.fetchEntityDetailsLoader = true;
      });

      const response = await customAttributesService.getPropertyDetails(workspaceSlug, propertyId);

      const entityChildren: { [key: string]: ICustomAttribute } = response.children.reduce(
        (acc, child) => ({
          ...acc,
          [child.id]: child,
        }),
        {}
      );

      runInAction(() => {
        this.entityAttributes = {
          ...this.entityAttributes,
          [propertyId]: entityChildren,
        };
        this.fetchEntityDetailsLoader = false;
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.fetchEntityDetailsLoader = false;
        this.error = error;
      });
    }
  };

  createEntity = async (workspaceSlug: string, data: Partial<ICustomAttribute>) => {
    try {
      const response = await customAttributesService.createProperty(workspaceSlug, data);

      runInAction(() => {
        this.entities = [...(this.entities ?? []), response];
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };

  deleteEntity = async (workspaceSlug: string, propertyId: string) => {
    try {
      await customAttributesService.deleteProperty(workspaceSlug, propertyId);

      const newEntities = this.entities?.filter((entity) => entity.id !== propertyId);

      runInAction(() => {
        this.entities = [...(newEntities ?? [])];
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };

  createEntityAttribute = async (
    workspaceSlug: string,
    data: Partial<ICustomAttribute> & { parent: string }
  ) => {
    try {
      runInAction(() => {
        this.createEntityAttributeLoader = true;
      });

      const response = await customAttributesService.createProperty(workspaceSlug, data);

      runInAction(() => {
        this.entityAttributes = {
          ...this.entityAttributes,
          [data.parent]: {
            ...this.entityAttributes[data.parent],
            [response.id]: response,
          },
        };
        this.createEntityAttributeLoader = false;
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error;
        this.createEntityAttributeLoader = false;
      });
    }
  };

  updateEntityAttribute = async (
    workspaceSlug: string,
    parentId: string,
    propertyId: string,
    data: Partial<ICustomAttribute>
  ) => {
    try {
      await customAttributesService.patchProperty(workspaceSlug, propertyId, data);

      const newEntities = this.entityAttributes[parentId];
      newEntities[propertyId] = {
        ...newEntities[propertyId],
        ...data,
      };

      runInAction(() => {
        this.entityAttributes = {
          ...this.entityAttributes,
          [parentId]: newEntities,
        };
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };

  deleteEntityAttribute = async (workspaceSlug: string, parentId: string, propertyId: string) => {
    try {
      await customAttributesService.deleteProperty(workspaceSlug, propertyId);

      const newEntities = this.entityAttributes[parentId];
      delete newEntities[propertyId];

      runInAction(() => {
        this.entityAttributes = {
          ...this.entityAttributes,
          [parentId]: newEntities,
        };
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };

  createAttributeOption = async (
    workspaceSlug: string,
    objectId: string,
    data: Partial<ICustomAttribute> & { parent: string }
  ) => {
    try {
      runInAction(() => {
        this.createAttributeOptionLoader = true;
      });

      const response = await customAttributesService.createProperty(workspaceSlug, data);

      runInAction(() => {
        this.entityAttributes = {
          ...this.entityAttributes,
          [objectId]: {
            ...this.entityAttributes[objectId],
            [data.parent]: {
              ...this.entityAttributes[objectId][data.parent],
              children: [...this.entityAttributes[objectId][data.parent].children, response],
            },
          },
        };
        this.createAttributeOptionLoader = false;
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error;
        this.createAttributeOptionLoader = false;
      });
    }
  };

  updateAttributeOption = async (
    workspaceSlug: string,
    objectId: string,
    parentId: string,
    propertyId: string,
    data: Partial<ICustomAttribute>
  ) => {
    try {
      const response = await customAttributesService.patchProperty(workspaceSlug, propertyId, data);

      const newOptions = this.entityAttributes[objectId][parentId].children.map((option) => ({
        ...option,
        ...(option.id === propertyId ? response : {}),
      }));

      runInAction(() => {
        this.entityAttributes = {
          ...this.entityAttributes,
          [objectId]: {
            ...this.entityAttributes[objectId],
            [parentId]: {
              ...this.entityAttributes[objectId][parentId],
              children: newOptions,
            },
          },
        };
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };

  deleteAttributeOption = async (
    workspaceSlug: string,
    objectId: string,
    parentId: string,
    propertyId: string
  ) => {
    try {
      const response = await customAttributesService.deleteProperty(workspaceSlug, propertyId);

      const newOptions = this.entityAttributes[objectId][parentId].children.filter(
        (option) => option.id !== propertyId
      );

      runInAction(() => {
        this.entityAttributes = {
          ...this.entityAttributes,
          [objectId]: {
            ...this.entityAttributes[objectId],
            [parentId]: {
              ...this.entityAttributes[objectId][parentId],
              children: newOptions,
            },
          },
        };
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };
}

export default CustomAttributesStore;
