interface DefaultOptions {
    showLeafArrayIndexes?: boolean;
    includeNullValues?: boolean;
    mapping?: Function;
}

const defaultOptions: DefaultOptions = {
    showLeafArrayIndexes: true,
    includeNullValues: true,
    mapping: function(value) {
        if (typeof value === 'boolean') {
            return +value ? '1' : '0';
        }
        return value;
    }
};

function isJsonObject(val) {
    return !Array.isArray(val) && typeof val === 'object' && !!val && !(val instanceof Blob);
}

export function objToFormData(jsonObject, options: DefaultOptions = {}) {
    const mergedOptions = {...defaultOptions, ...options};
    return convertRecursively(jsonObject, mergedOptions);
}

function convertRecursively(jsonObject: object, options: DefaultOptions, parentKey?: string, carryFormData?: FormData) {
    const formData = carryFormData || new FormData();

    let index = 0;

    for (const key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            let propName = parentKey || key;
            const value = options.mapping(jsonObject[key]);

            if (parentKey && isJsonObject(jsonObject)) {
                propName = parentKey + '[' + key + ']';
            }

            if (parentKey && Array.isArray(jsonObject)) {
                if (Array.isArray(value) || options.showLeafArrayIndexes ) {
                    propName = parentKey + '[' + index + ']';
                } else {
                    propName = parentKey + '[]';
                }
            }

            if (Array.isArray(value) || isJsonObject(value)) {
                convertRecursively(value, options, propName, formData);
            } else if (value instanceof FileList) {
                for (let j = 0; j < value.length; j++) {
                    formData.append(propName + '[' + j + ']', value.item(j));
                }
            } else if (value instanceof Blob) {
                formData.append(propName, value, value['name']);
            } else if (((value === null && options.includeNullValues) || value !== null) && value !== undefined) {
                formData.append(propName, value);
            }
        }

        index++;
    }

    return formData;
}
