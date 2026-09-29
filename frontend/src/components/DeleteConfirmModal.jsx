const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName, isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title text-danger">Delete Product</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="delete-modal-text">
            Are you sure you want to delete <strong>&quot;{productName}&quot;</strong>?
          </p>
          <p className="text-muted delete-modal-warning">
            This action cannot be undone. The product will be permanently removed from the catalog.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            id="confirm-delete-btn"
          >
            {isDeleting ? (
              <>
                <span className="spinner-sm"></span> Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
