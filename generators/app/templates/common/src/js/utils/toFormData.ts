
export default function toFormData(json:object):FormData {
    return Object.entries(json).reduce((data, [prop, val]) => {
		data.append(prop, val);
		return data;
	}, new FormData());
}

