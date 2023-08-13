let lastComponentId = 0;

function newComponent() {
	return ++lastComponentId;
}

export { newComponent };
export default { newComponent };
