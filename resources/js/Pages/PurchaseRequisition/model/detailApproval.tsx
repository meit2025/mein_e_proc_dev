import {
  WorkflowApprovalDiagramInterface,
  WorkflowApprovalStepInterface,
  WorkflowComponent,
} from '@/components/commons/WorkflowComponent';
import { useFormContext } from 'react-hook-form';

const DetailApproval = () => {
  const { getValues, watch } = useFormContext();

  return (
    <>
      <WorkflowComponent
        workflowApproval={{
          approvalRequest: getValues('approvalRequest') ?? [],
          approvalFrom: getValues('approvalFrom') ?? [],
          acknowledgeFrom: getValues('acknowledgeFrom') ?? [],
        }}
        workflowApprovalStep={getValues('approvalFrom') as unknown as WorkflowApprovalStepInterface}
        workflowApprovalDiagram={
          getValues('approvalFrom') as unknown as WorkflowApprovalDiagramInterface
        }
      />
    </>
  );
};

export default DetailApproval;
