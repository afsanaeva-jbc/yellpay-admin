// import type { PayloadAction } from "@reduxjs/toolkit";
// import { createSlice } from "@reduxjs/toolkit";
// import type { WorkflowV2 } from "../models/models";
// interface WorkflowState {
//   currentWorkflow: WorkflowV2 | null;
// }
// const initialState: WorkflowState = {
//   currentWorkflow: null,
// };

// const workflowSlice = createSlice({
//   name: "workflow",
//   initialState,
//   reducers: {
//     setWorkflow: (state, action: PayloadAction<WorkflowV2>) => {
//       state.currentWorkflow = action.payload;
//     },
//     clearWorkflow: (state) => {
//       state.currentWorkflow = null;
//     },
//   },
// });
// export const { setWorkflow, clearWorkflow } = workflowSlice.actions;
// export default workflowSlice.reducer;
