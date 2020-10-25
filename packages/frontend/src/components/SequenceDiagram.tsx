import { useMachine } from "@xstate/compiled/react";
import React from "react";
import ContentEditable from "react-contenteditable";
import HeroIconPlus from "./icons/HeroIconPlus";
import HeroIconX from "./icons/HeroIconX";
import { sequenceDiagramMachine } from "./SequenceDiagram.machine";
import { StepArrow } from "./StepArrow";

export const SequenceDiagramWrapper: React.FC<{
  title: string;
  onChangeTitle: (title: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}> = ({ children, title, onChangeTitle, onDelete, onDuplicate }) => {
  return (
    <div className="border-2 relative">
      <div>
        <div className="flex items-center border-b-2 bg-gray-100">
          <ContentEditable
            className="text-gray-700 font-bold text-lg flex-grow px-3 py-2"
            html={title}
            tagName="h2"
            onChange={(e) => onChangeTitle(e.target.value)}
          ></ContentEditable>
          <div className="px-3 flex-shrink-0">
            <button
              onClick={onDuplicate}
              className="text-xs uppercase px-3 py-2"
            >
              Duplicate
            </button>
          </div>
        </div>
        <button
          className="absolute top-0 right-0 bg-gray-600 text-white rounded-full w-4 h-4 -mt-2 -mr-2 flex justify-center items-center"
          onClick={() => onDelete()}
        >
          <HeroIconX />
        </button>
      </div>
      <div className="px-3 py-3 overflow-x-auto">{children}</div>
    </div>
  );
};

export const SequenceDiagram = (props: {
  steps: {
    from: string;
    to: string;
    event: string;
  }[];
  environments: {
    id: string;
    name: string;
  }[];
  onAddStep: (step: { from: string; to: string; index: number }) => void;
  onEditEvent: (newEvent: string, index: number) => void;
  onDeleteStep: (index: number) => void;
  onEditEnvironment: (newName: string, id: string) => void;
  onCreateEnvironment: () => void;
  onDeleteEnvironment: (id: string) => void;
}) => {
  const [state, dispatch] = useMachine(sequenceDiagramMachine, {
    actions: {
      registerNewEvent: (context, event) => {
        props.onAddStep({
          from: context.environmentChosen,
          to: event.environment,
          index: event.index,
        });
      },
    },
  });
  return (
    <div className="inline-block">
      <div className="flex space-x-6">
        {props.environments.map((env, index) => {
          return (
            <div className="relative">
              <ContentEditable
                className="p-4 bg-gray-200 text-gray-800 uppercase w-48 block text-center"
                html={env.name}
                onChange={(e) =>
                  props.onEditEnvironment(e.target.value, env.id)
                }
              ></ContentEditable>
              <button
                className="absolute top-0 right-0 bg-gray-600 text-white rounded-full w-4 h-4 -mt-2 -mr-2 flex justify-center items-center"
                onClick={() => props.onDeleteEnvironment(env.id)}
              >
                <HeroIconX />
              </button>
            </div>
          );
        })}
        <button
          className="p-4 w-16 flex justify-center items-center bg-gray-200 text-gray-800"
          onClick={props.onCreateEnvironment}
        >
          <HeroIconPlus />
        </button>
      </div>
      {/* <div className="flex space-x-6">
        {props.environments.map((env) => {
          return (
            <div className="flex justify-center items-center w-48 h-6">
              <div className="border-r-2"></div>
            </div>
          );
        })}
      </div> */}
      {props.steps.map((step, index, array) => {
        return (
          <>
            <div className="flex space-x-6">
              {props.environments.map((env) => {
                return (
                  <div className="flex justify-center w-48 h-10 relative">
                    <div className="border-r-2"></div>

                    <button
                      className={classNames(
                        "absolute h-6 w-24 mt-2 top-0 flex justify-center group",
                      )}
                      onClick={() => {
                        dispatch({
                          type: "CLICK_PLUS_ICON",
                          environment: env.id,
                          index,
                        });
                      }}
                    >
                      <div
                        className={classNames(
                          "w-6 h-6 rounded-full bg-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 group-focus:opacity-100",
                          env.id === state.context.environmentChosen &&
                            index === state.context.indexChosen &&
                            "opacity-100 bg-blue-200 text-blue-800",
                        )}
                      >
                        <HeroIconPlus />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            <StepArrow
              step={step}
              onDelete={() => props.onDeleteStep(index)}
              environments={props.environments}
              onChangeEvent={(event) => props.onEditEvent(event, index)}
            />
          </>
        );
      })}
      <div className="flex space-x-6">
        {props.environments.map((env) => {
          return (
            <div className="flex justify-center w-48 h-6">
              <div className="border-r-2"></div>
            </div>
          );
        })}
      </div>
      <div className="flex space-x-6">
        {props.environments.map((env) => {
          return (
            <div className="flex justify-center w-48">
              <button
                className={classNames(
                  "bg-gray-200 rounded-full h-10 w-10 flex justify-center items-center text-gray-600",
                  env.id === state.context.environmentChosen &&
                    props.steps.length === state.context.indexChosen &&
                    "bg-blue-200 text-blue-800",
                )}
                onClick={() => {
                  dispatch({
                    type: "CLICK_PLUS_ICON",
                    environment: env.id,
                    index: props.steps.length,
                  });
                }}
              >
                <HeroIconPlus />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex space-x-6">
        {props.environments.map((env) => {
          return (
            <div className="flex justify-center w-48 h-6">
              <div className="border-r-2"></div>
            </div>
          );
        })}
      </div>
      <div className="flex space-x-6">
        {props.environments.map((env, index) => {
          return (
            <ContentEditable
              className="p-4 bg-gray-200 text-gray-800 uppercase w-48 block text-center"
              html={env.name}
              onChange={(e) => props.onEditEnvironment(e.target.value, env.id)}
            ></ContentEditable>
          );
        })}
        <button
          className="p-4 w-16 flex justify-center items-center bg-gray-200 text-gray-800"
          onClick={props.onCreateEnvironment}
        >
          <HeroIconPlus />
        </button>
      </div>
    </div>
  );
};
