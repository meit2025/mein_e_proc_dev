import {
  WorkflowApprovalDiagramInterface,
  WorkflowApprovalStepInterface,
  WorkflowComponent,
} from '@/components/commons/WorkflowComponent';
import { useForm, useFormContext } from 'react-hook-form';

const DetailApproval = ({ methods }: { methods: ReturnType<typeof useForm> }) => {
  return (
    <>
      <WorkflowComponent
        workflowApproval={{
          approvalRequest: methods.getValues('approvalRequest') ?? [],
          approvalFrom: methods.getValues('approvalFrom') ?? [],
          acknowledgeFrom: methods.getValues('acknowledgeFrom') ?? [],
        }}
        workflowApprovalStep={
          methods.getValues('approvalFromStatusRoute') as unknown as WorkflowApprovalStepInterface
        }
        workflowApprovalDiagram={
          methods.getValues('approvalFrom') as unknown as WorkflowApprovalDiagramInterface
        }
      />
    </>
  );
};

export default DetailApproval;
