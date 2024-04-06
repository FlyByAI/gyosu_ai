import React, { ReactNode, useState } from 'react';

interface DaisyModalProps {
  children: ReactNode;
  canCloseBeforeSubmit?: boolean;
  openDefault: boolean;
}

const DaisyModal: React.FC<DaisyModalProps> = ({ children, canCloseBeforeSubmit, openDefault }) => {
  const [isOpen, setIsOpen] = useState(openDefault);

  return (
    <>
      {!openDefault &&
        <button className="btn btn-primary" onClick={() => setIsOpen(true)}>Open Modal</button>
      }
      {isOpen && (
        <div className="modal modal-open" onClick={() => setIsOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {children}
            <div className="modal-action">
              {canCloseBeforeSubmit &&
                <button className="btn" onClick={() => setIsOpen(false)}>Close</button>
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DaisyModal;
