import React from 'react';

import { CircleUserRound } from 'lucide-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
export function WorkflowBorder({
  children,
  title = 'title',
}: React.PropsWithChildren<{
  title: string;
}>) {
  return (
    <div className='relative'>
      <h1 className='absolute -top-2  px-2  text-xs font-bold left-4 py-1 bg-white'>{title}</h1>

      <div className='border pt-6 pb-4 border-gray-600 p-4 w-full rounded-md'>
        <div>{children}</div>
      </div>
    </div>
  );
}

export interface WorkflowApprovalInterface {
  approvalRequest: string[];
  approvalFrom: string[];
  acknowledgeFrom: string[];
}
export function WorkflowApproval({
  workflowApproval = {
    approvalRequest: ['user1', 'user2'],
    approvalFrom: ['user1', 'user2'],
    acknowledgeFrom: ['user1', 'user2'],
  },
}: {
  workflowApproval: WorkflowApprovalInterface;
}) {
  return (
    <div>
      <WorkflowBorder title='Workflow Approval'>
        <table className='w-full text-xs'>
          <tr>
            <td width='300'>Expected Request Approval Name</td>
            <td>{workflowApproval.approvalRequest.join(' ')}</td>
          </tr>
          <tr>
            <td width='300'>Expected Approval From</td>
            <td>{workflowApproval.approvalFrom.join(' ')}</td>
          </tr>

          <tr>
            <td width='300'>Expected Acknowledge From</td>
            <td>{workflowApproval.acknowledgeFrom.join(' ')}</td>
          </tr>
        </table>
      </WorkflowBorder>
    </div>
  );
}

export interface WorkflowApprovalStepInterface {
  workflowApprovalDiagram?: WorkflowApprovalStepInterfaceStatus[];
}

export interface WorkflowApprovalStepInterfaceStatus {
  status: string;
  name: string;
  dateApproved: string;
}

export function WorkflowApprovalStep({
  workflowApprovalDiagram = [
    {
      status: 'Approved',
      name: 'dono',
      dateApproved: '2022-01-01',
    },
    {
      status: 'Approved',
      name: 'kasino',
      dateApproved: '2022-01-01',
    },
    {
      status: 'Approved',
      name: 'indro',
      dateApproved: '2022-01-01',
    },
  ],
}: WorkflowApprovalStepInterface) {
  return (
    <div>
      <WorkflowBorder title='Workflow Approval Step'>
        <table className='w-full text-xs'>
          <tr>
            <td width='300'>Step</td>
            <td>Name</td>
            <td>Status</td>
            <td>Date Approved</td>
          </tr>
          {workflowApprovalDiagram.map(
            (item: WorkflowApprovalStepInterfaceStatus, index: number) => {
              return (
                <tr key={index}>
                  <td width='300'>Step {index + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    {item.status === 'Approved' && <CheckCircleIcon style={{ color: 'green' }} />}
                    {item.status === 'Rejected' && <CancelIcon style={{ color: 'red' }} />}
                    {item.status === 'Waiting' && <RemoveCircleIcon style={{ color: 'orange' }} />}
                  </td>
                  <td>
                    {' '}
                    {(item.status === 'Approved' || item.status === 'Rejected') &&
                      item.dateApproved}
                  </td>
                </tr>
              );
            },
          )}
        </table>
      </WorkflowBorder>
    </div>
  );
}

export interface WorkflowApprovalDiagramInterface {
  workflowApprovalDiagram: string[];
}

export function WorkflowApprovalDiagram({
  workflowApprovalDiagram = [],
}: WorkflowApprovalDiagramInterface) {
  return (
    <div>
      <WorkflowBorder title='Workflow Approval Diagram'>
        <div className='flex items-center flex-wrap gap-3'>
          <div className='mr-2'>
            <CircleUserRound />
          </div>

          {workflowApprovalDiagram.map((item, index) => {
            return (
              <div className='flex items-center' key={index}>
                <hr className='bg-orange-600 w-12 h-1  mr-2 rounded-full' />
                <CircleUserRound />
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </WorkflowBorder>
    </div>
  );
}

export function WorkflowComponent({
  workflowApproval,
  workflowApprovalStep,
  workflowApprovalDiagram,
}: {
  workflowApproval: WorkflowApprovalInterface;
  workflowApprovalStep: WorkflowApprovalStepInterface;
  workflowApprovalDiagram: WorkflowApprovalDiagramInterface;
}) {
  return (
    <div className='flex flex-col rounded-xl space-y-6 border border-gray-200 p-4'>
      <WorkflowApproval workflowApproval={workflowApproval} />
      <WorkflowApprovalStep workflowApprovalDiagram={workflowApprovalStep} />
      <WorkflowApprovalDiagram workflowApprovalDiagram={workflowApprovalDiagram} />
    </div>
  );
}
