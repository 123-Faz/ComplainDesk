import { toast } from "react-toastify";

interface ToastData {
	status?: number | string; // optional status code or description
	message: string | string[];
	type: "success" | "error" | "info" | "warning";
	toastId?: string;
}

const ShowToast = (toastData?: ToastData) => {
	if (!toastData) return;
	const { message, type, status, toastId } = toastData;
	const content = (
		<div>
			{status && <strong className="block">Status: {status}</strong>}
			{Array.isArray(message) ? (
				<ul className="ml-4">
					{message.map((msg, i) => (
						<li key={i}>{msg}</li>
					))}
				</ul>
			) : typeof message === "object" && message !== null ? (
				<ul className="ml-4">
					{Object.entries(message).map(([key, value], i) => (
						<li key={i}>
							<strong>{key}:</strong> {String(value)}
						</li>
					))}
				</ul>
			) : (
				message
			)}
		</div>
	);

	if (toastId && toast.isActive(toastId)) {
		toast.update(toastId, {
			render: content,
			type,
			isLoading: false,
		});
		return;
	} else {
		toast(content, { type, toastId });
	}

	return;
};

export default ShowToast;
