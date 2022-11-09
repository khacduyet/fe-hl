import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method

export const confirm = (func, message, header, acceptLabel, rejectLabel) => {
  confirmDialog({
    message: message ? message : "Are you sure you want to proceed?",
    header: header ? header : "Confirmation",
    acceptLabel: acceptLabel ? acceptLabel : "Yes",
    rejectLabel: rejectLabel ? rejectLabel : "No",
    icon: "pi pi-exclamation-triangle",
    accept: () => func(),
    reject: () => { },
  });
};

export const Confirm = ({ visible, setVisible, func, message, header, acceptLabel, rejectLabel }) => {
  return (
    <>
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(!visible)}
        message={message ? message : "Are you sure you want to proceed?"}
        header={header ? header : "Confirmation"}
        acceptLabel={acceptLabel ? acceptLabel : "Yes"}
        rejectLabel={rejectLabel ? rejectLabel : "No"}
        icon="pi pi-exclamation-triangle"
        accept={func}
        reject={() => { }}
      />
    </>
  )
}