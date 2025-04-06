import React from 'react';
import styled from 'styled-components';

const CustomCheckbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, id, ...props }, ref) => {
  // إنشاء معرف فريد إذا لم يتم توفيره
  const uniqueId = id || `custom-cbx-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <StyledWrapper className={className} dir="rtl">
      <label className="container">
        <input 
          ref={ref} 
          type="checkbox" 
          id={uniqueId} 
          {...props} 
        />
        <div className="checkmark" />
      </label>
    </StyledWrapper>
  );
});

CustomCheckbox.displayName = "CustomCheckbox";

const StyledWrapper = styled.div`
  /* Hide the default checkbox */
  .container input {
   position: absolute;
   opacity: 0;
   cursor: pointer;
   height: 0;
   width: 0;
  }

  .container {
   display: block;
   position: relative;
   cursor: pointer;
   font-size: 20px;
   user-select: none;
  }

  /* Create a custom checkbox */
  .checkmark {
   position: relative;
   top: 0;
   right: 0; /* تغيير من left إلى right لدعم RTL */
   height: 1.3em;
   width: 1.3em;
   background-color: #ccc;
   border-bottom-left-radius: 15px;
   border-top-right-radius: 15px;
   box-shadow: 0px 0px 17px #c7bbb8;
  }

  /* When the checkbox is checked, add an orange background */
  .container input:checked ~ .checkmark {
   background-color: #f34b21;
   box-shadow: 0px 0px 17px #f34b21;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
   content: "";
   position: absolute;
   display: none;
  }

  /* Show the checkmark when checked */
  .container input:checked ~ .checkmark:after {
   display: block;
  }

  /* Style the checkmark/indicator */
  .container .checkmark:after {
   right: 0.45em; /* تغيير من left إلى right لدعم RTL */
   top: 0.25em;
   width: 0.25em;
   height: 0.5em;
   border: solid rgb(233, 222, 222);
   border-width: 0 0.15em 0.15em 0;
   transform: rotate(45deg);
  }
`;

export { CustomCheckbox };