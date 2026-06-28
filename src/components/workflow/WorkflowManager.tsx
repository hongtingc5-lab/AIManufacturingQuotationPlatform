'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { WorkflowStep } from '@/types';
import UploadWorkflow from '@/components/workflow/Upload';
import Viewer3DWorkflow from '@/components/workflow/Viewer3D';
import StructureWorkflow from '@/components/workflow/Structure';
import DFMWorkflow from '@/components/workflow/DFM';
import MoldWorkflow from '@/components/workflow/Mold';
import FlowWorkflow from '@/components/workflow/Flow';
import QuoteWorkflow from '@/components/workflow/Quote';
import DistillationWorkflow from '@/components/workflow/Distillation';

export default function WorkflowManager() {
  const { currentStep } = useStore();

  const renderWorkflow = () => {
    switch (currentStep) {
      case WorkflowStep.UPLOAD:
        return <UploadWorkflow />;
      case WorkflowStep.VIEWER_3D:
        return <Viewer3DWorkflow />;
      case WorkflowStep.STRUCTURE:
        return <StructureWorkflow />;
      case WorkflowStep.DFM:
        return <DFMWorkflow />;
      case WorkflowStep.MOLD:
        return <MoldWorkflow />;
      case WorkflowStep.FLOW:
        return <FlowWorkflow />;
      case WorkflowStep.QUOTE:
        return <QuoteWorkflow />;
      case WorkflowStep.DISTILLATION:
        return <DistillationWorkflow />;
      default:
        return <UploadWorkflow />;
    }
  };

  return (
    <div className="h-full">
      {renderWorkflow()}
    </div>
  );
}