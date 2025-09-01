import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, SnackbarCloseReason } from '@mui/material';

interface PageWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
  open?: boolean | false;
  setOpen?: (open: boolean) => void;
  message?: string;
  severity?: "success" | "warning" | "error";
  dialogueOpen?: boolean;
  dialogueContent?: React.ReactNode;
  dialogueTitle?: string;
  dialogueActions?: React.ReactNode;
  dialogueClose?: () => void;
  isAuth?: boolean;
  dialogueSx?: object;
}

const PageWrapper = ({ children, loading = false, open, setOpen, message, severity = "success", dialogueOpen,
  dialogueActions, dialogueContent, dialogueTitle, dialogueClose, isAuth = false, dialogueSx
}: PageWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000} onClose={handleClose} >
        <Alert
          sx={{
            mt: "6rem",
            zIndex: 9999
          }}
          onClose={handleClose}
          severity={severity}
        >
          {message}
        </Alert>
      </Snackbar>
      {
        loading ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: isAuth ? '75vh' : '90vh',
          }}>
            <CircularProgress />
          </Box>
        ) :
          <Box
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              px: 6,
              position: 'relative',
            }}
          >
            {children}
          </Box>
      }
      <Dialog open={dialogueOpen ?? false} onClose={dialogueClose} fullWidth sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "auto",
            minWidth: "600px",
            maxWidth: "1024px",
            borderRadius: "12px",
          },
        },
        ...dialogueSx,
      }}>
        <DialogTitle sx={{
          fontSize: "1.3rem", fontWeight: "600",
          padding: "24px 35px 16px 35px",
        }}>{dialogueTitle}</DialogTitle>
        <DialogContent sx={{
          fontSize: "0.9rem", fontWeight: "400",
          padding: "16px 35px",
        }}>
          {dialogueContent}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "right", padding: "8px 20px 20px 0px" }}>
          {dialogueActions}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PageWrapper;
