import CloseIcon from '@mui/icons-material/Close'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material'
import { Theme } from '@mui/system'


export default function DialogBar({
    title,
    submitButtonLabel,
    isOpen,
    isSubmitDisabled,
    onClose,
    onSubmit,
    children,
}) {
    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth>
            <DialogTitle variant="title_sm" fontWeight="bold">
                {title}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 18,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent
                sx={{
                    padding: '32px',
                    display: 'grid',
                    gap: '32px',
                }}
                dividers
            >{children}</DialogContent>

            <DialogActions sx={{padding: '16px 32px'}}>
                <Button variant="contained" color="secondary" onClick={onClose}>
                    Cancel
                </Button>

                <Button variant="contained" color="primary" onClick={onSubmit} disabled={isSubmitDisabled}>
                    {submitButtonLabel || title}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
