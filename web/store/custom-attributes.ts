// mobx
import { action, observable, runInAction, makeAutoObservable } from "mobx";
// services
import customAttributesService from "services/custom-attributes.service";
// types
import type { ICustomAttribute } from "types";

class CustomAttributesStore {
  objects: ICustomAttribute[] | null = null;
  objectAttributes: {
    [objectId: string]: { [objectAttributeId: string]: ICustomAttribute };
  } = {};
  // loaders
  fetchObjectsLoader = false;
  fetchObjectDetailsLoader = false;
  createObjectAttributeLoader = false;
  createAttributeOptionLoader = false;
  // errors
  attributesFetchError: any | null = null;
  error: any | null = null;
  rootStore: any | null = null;

  constructor(_rootStore: any | null = null) {
    makeAutoObservable(this, {
      objects: observable.ref,
      objectAttributes: observable.ref,
      fetchObjects: action,
      fetchObjectDetails: action,
      createObject: action,
      updateObject: action,
      deleteObject: action,
      createObjectAttribute: action,
      updateObjectAttribute: action,
      deleteObjectAttribute: action,
      createAttributeOption: action,
      updateAttributeOption: action,
      deleteAttributeOption: action,
    });

    this.rootStore = _rootStore;
  }

  fetchObjects = async (workspaceSlug: string, projectId: string) => {
    try {
      runInAction(() => {
        this.fetchObjectsLoader = true;
      });

      const response = await customAttributesService.getObjectsList(workspaceSlug, {
        project: projectId,
      });

      if (response) {
        runInAction(() => {
          this.objects = response;
          this.fetchObjectsLoader = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.fetchObjectsLoader = false;
        this.attributesFetchError = error;
      });
    }
  };

  fetchObjectDetails = async (workspaceSlug: string, objectId: string) => {
    try {
      runInAction(() => {
        this.fetchObjectDetailsLoader = true;
      });

      const response = await customAttributesService.getAttributeDetails(workspaceSlug, objectId);

      const objectChildren: { [key: string]: ICustomAttribute } = response.children.reduce(
        (acc, child) => ({
          ...acc,
          [child.id]: child,
        }),
        {}
      );

      runInAction(() => {
        this.objectAttributes = {
          ...this.objectAttributes,
          [objectId]: objectChildren,
        };
        this.fetchObjectDetailsLoader = false;
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.fetchObjectDetailsLoader = false;
        this.error = error;
      });
    }
  };

  createObject = async (workspaceSlug: string, data: Partial<ICustomAttribute>) => {
    try {
      const response = await customAttributesService.createAttribute(workspaceSlug, data);

      runInAction(() => {
        this.objects = [...(this.objects ?? []), response];
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };

  updateObject = async (
    workspaceSlug: string,
    objectId: string,
    data: Partial<ICustomAttribute>
  ) => {
    try {
      const response = await customAttributesService.patchAttribute(workspaceSlug, objectId, data);

      const newObjects = [...(this.objects ?? [])].map((object) =>
        object.id === objectId ? { ...object, ...response } : object
      );

      runInAction(() => {
        this.objects = newObjects;
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };

  deleteObject = async (workspaceSlug: string, objectId: string) => {
    try {
      await customAttributesService.deleteAttribute(workspaceSlug, objectId);

      const newObjects = this.objects?.filter((object) => object.id !== objectId);

      runInAction(() => {
        this.objects = [...(newObjects ?? [])];
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };

  createObjectAttribute = async (
    workspaceSlug: string,
    data: Partial<ICustomAttribute> & { parent: string }
  ) => {
    try {
      runInAction(() => {
        this.createObjectAttributeLoader = true;
      });

      const response = await customAttributesService.createAttribute(workspaceSlug, data);

      runInAction(() => {
        this.objectAttributes = {
          ...this.objectAttributes,
          [data.parent]: {
            ...this.objectAttributes[data.parent],
            [response.id]: response,
          },
        };
        this.createObjectAttributeLoader = false;
      });

      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error;
        this.createObjectAttributeLoader = false;
      });
    }
  };

  updateObjectAttribute = async (
    workspaceSlug: string,
    parentId: string,
    propertyId: string,
    data: Partial<ICustomAttribute>
  ) => {
    try {
      await customAttributesService.patchAttribute(workspaceSlug, propertyId, data);

      const newObjects = this.objectAttributes[parentId];
      newObjects[propertyId] = {
        ...newObjects[propertyId],
        ...data,
      };

      runInAction(() => {
        this.objectAttributes = {
          ...this.objectAttributes,
          [parentId]: newObjects,
        };
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };

  deleteObjectAttribute = async (workspaceSlug: string, parentId: string, propertyId: string) => {
    try {
      await customAttributesService.deleteAttribute(workspaceSlug, propertyId);

      const newObjects = this.objectAttributes[parentId];
      delete newObjects[propertyId];

      runInAction(() => {
        this.objectAttributes = {
          ...this.objectAttributes,
          [parentId]: newObjects,
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

      const response = await customAttributesService.createAttribute(workspaceSlug, data);

      runInAction(() => {
        this.objectAttributes = {
          ...this.objectAttributes,
          [objectId]: {
            ...this.objectAttributes[objectId],
            [data.parent]: {
              ...this.objectAttributes[objectId][data.parent],
              children: [...this.objectAttributes[objectId][data.parent].children, response],
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
      const response = await customAttributesService.patchAttribute(
        workspaceSlug,
        propertyId,
        data
      );

      const newOptions = this.objectAttributes[objectId][parentId].children.map((option) => ({
        ...option,
        ...(option.id === propertyId ? response : {}),
      }));

      runInAction(() => {
        this.objectAttributes = {
          ...this.objectAttributes,
          [objectId]: {
            ...this.objectAttributes[objectId],
            [parentId]: {
              ...this.objectAttributes[objectId][parentId],
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
    const newOptions = this.objectAttributes[objectId][parentId].children.filter(
      (option) => option.id !== propertyId
    );

    try {
      runInAction(() => {
        this.objectAttributes = {
          ...this.objectAttributes,
          [objectId]: {
            ...this.objectAttributes[objectId],
            [parentId]: {
              ...this.objectAttributes[objectId][parentId],
              children: newOptions,
            },
          },
        };
      });

      await customAttributesService.deleteAttribute(workspaceSlug, propertyId);
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });

      this.fetchObjectDetails(workspaceSlug, objectId);
    }
  };
}

export default CustomAttributesStore;
