import {
  WorkflowApprovalDiagramInterface,
  WorkflowApprovalStepInterface,
  WorkflowComponent,
} from '@/components/commons/WorkflowComponent';
import { useForm } from 'react-hook-form';

const DetailApproval = ({ methods }: { methods: ReturnType<typeof useForm> }) => {
  return (
    <div
      style={{
        marginTop: '20px',
      }}
    >
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
    </div>
  );
};

export default DetailApproval;
