import React from 'react';

import { CircleUserRound } from 'lucide-react';
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
  workflowApprovalStep: string[];
}

export function WorkflowApprovalStep({
  workflowApprovalStep = ['Debby', 'Bagus'],
}: WorkflowApprovalStepInterface) {
  return (
    <div>
      <WorkflowBorder title='Workflow Approval Step'>
        <table className='w-full text-xs'>
          {workflowApprovalStep.map((item: string, index: number) => {
            return (
              <tr key={index}>
                <td width='300'>Step {index + 1}</td>
                <td>{item}</td>
              </tr>
            );
          })}
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
        <div className='flex items-center '>
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
  workflowApprovalStep = ['debi', 'hai'],
  workflowApprovalDiagram = ['debi'],
}: {
  workflowApproval: WorkflowApprovalInterface;
  workflowApprovalStep: WorkflowApprovalStepInterface;
  workflowApprovalDiagram: WorkflowApprovalDiagramInterface;
}) {
  return (
    <div className='flex flex-col rounded-xl space-y-6 border border-gray-200 p-4'>
      <WorkflowApproval workflowApproval={workflowApproval} />

      <WorkflowApprovalStep workflowApprovalStep={workflowApprovalStep} />

      <WorkflowApprovalDiagram workflowApprovalDiagram={workflowApprovalDiagram} />
    </div>
  );
}
