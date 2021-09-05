/*export const STATUS_00 = {
	key: 0,
	code: "STATUS_00",
	info: "PROCESS_NOT_INITIALIZED",
};*/
export const STATUS_00 = {
	key: 0,
	code: "STATUS_00",
	info: "INFORMATION_PROCESS",
	status: "default",
};
export const STATUS_01 = {
	key: 1,
	code: "STATUS_01",
	info: "DOCUMENTATION_PROCESS",
	status: "default",
};
export const STATUS_02 = {
	key: 2,
	code: "STATUS_02",
	info: "INFORMATION_ERROR",
	message: "Ha ocurrido un error con tu información.",
	status: "error",
};
export const STATUS_03 = {
	key: 2,
	code: "STATUS_03",
	info: "SERVICES_APPROVAL_WAIT",
	message:
		"Documentación en forma para enviar al departamento de servicios escolares.",
	status: "default",
};
export const STATUS_04 = {
	key: 2,
	code: "STATUS_04",
	info: "DOCUMENTATION_INFORMATION_ERROR",
	message:
		"Ha ocurrido un error con tu información o documentación. Sigue las indicaciones.",
	status: "error",
};
export const STATUS_05 = {
	key: 2,
	code: "STATUS_05",
	info: "SERVICES_APPROVAL_PROCESSING",
	message: "La documentación aún no ha sido aprobada. Por favor espera.",
	status: "processing",
};
export const STATUS_06 = {
	key: 2,
	code: "STATUS_06",
	info: "SERVICES_APPROVAL_SUCCESS",
	message: "La documentación ha sido aprobada.",
	status: "success",
};
export const STATUS_07 = {
	key: 3,
	code: "STATUS_07",
	info: "SELECT_TITULATION_TYPE",
	message: "Selecciona el tipo de titulación",
	status: "default",
};
export const STATUS_09 = {
	key: 4,
	code: "STATUS_09",
	info: "COORDINATION_APPROVAL",
};
export const STATUS_10 = {
	key: 4,
	code: "STATUS_10",
	info: "FIRST_SECCION_COMPLETE",
};
