import * as statusTypes from "../../const/statusTypes";

const defaultStatus = 0;

const currentStep = (currentStatus) => {
	switch (currentStatus) {
		case statusTypes.STATUS_00.code:
			return statusTypes.STATUS_00.key;
		case statusTypes.STATUS_01.code:
			return statusTypes.STATUS_01.key;
		case statusTypes.STATUS_02.code:
			return statusTypes.STATUS_02.key;
		case statusTypes.STATUS_03.code:
			return statusTypes.STATUS_03.key;
		case statusTypes.STATUS_04.code:
			return statusTypes.STATUS_04.key;
		case statusTypes.STATUS_05.code:
			return statusTypes.STATUS_05.key;
		case statusTypes.STATUS_06.code:
			return statusTypes.STATUS_06.key;
		case statusTypes.STATUS_07.code:
			return statusTypes.STATUS_07.key;
		default:
			return defaultStatus;
	}
};

export default currentStep;
