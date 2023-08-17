import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
  } from "@material-ui/core";
  
  const ConfirmationDialog = (props) => {
    const { open, onClose, onConfirm, title, description } = props;
    return (
      
      <Dialog
        open={open}
        onClose={() => onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="cancel-popup"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
          variant="contained"
          color="secondary"
            onClick={() => {
              onConfirm();
            }}
            autoFocus
            className="btn green-btn"
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={() => onClose()}
            className="btn pink-btn"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ConfirmationDialog;
  