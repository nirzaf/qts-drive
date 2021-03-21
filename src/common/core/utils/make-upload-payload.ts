export function makeUploadPayload(file: File|Blob, httpParams: {[key: string]: any}): FormData {
    const data = new FormData();

    if (httpParams) {
        Object.keys(httpParams).forEach(key => {
            let value = httpParams[key];
            if (value === null) value = '';
            setData(data, key, value);
        });
    }

    setData(data, 'file', file);

    return data;
}

function setData(formData: FormData, key: string, value: any) {
    if (formData.set) {
        formData.set(key, value);
    } else {
        formData.append(key, value);
    }
}
