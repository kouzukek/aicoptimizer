import { useState, type FC } from "react";
import { useAtom } from "jotai";

import { Menu } from "@base-ui/react/menu";

import { additionalRequirementsAtom } from "../../lib/store";
import { resource_group, resource_list, type Group } from "../../lib/recipes";
import type { SolverRequest } from "../../lib/types";

import {
  FaBackward,
  FaCaretDown,
  FaCaretRight,
  FaTrash,
} from "react-icons/fa6";

import styles from "./requirements.module.scss";

type Target = keyof SolverRequest["additionalRequirements"];

const ResourceSelector: FC<{ target: Target }> = ({ target }) => {
  const [_reqs, setter] = useAtom(additionalRequirementsAtom);
  const reqs = _reqs[target] ?? [];

  const [path, setPath] = useState<Group[string]>(resource_group);
  const [parent, setParent] = useState<Group[]>([]);

  return (
    <Menu.Root
      onOpenChange={() => {
        setPath(resource_group);
        setParent([]);
      }}
    >
      <Menu.Trigger className={styles.button}>
        追加
        <FaCaretDown />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className={styles.positioner} align="start">
          <Menu.Popup className={styles.popup}>
            {parent.length > 0 && (
              <Menu.Item
                closeOnClick={false}
                onClick={() => {
                  const [prev, ...rest] = parent;
                  setPath(prev);
                  setParent(rest);
                }}
                className={styles.item}
              >
                <FaBackward /> Back
              </Menu.Item>
            )}
            {path instanceof Array
              ? path.map((id) => (
                  <Menu.Item
                    key={id}
                    onClick={() => {
                      setter(target, id, {});
                    }}
                    disabled={reqs.some(([rid]) => rid === id)}
                    className={styles.item}
                  >
                    {resource_list[id].name}
                  </Menu.Item>
                ))
              : Object.keys(path).map((gid) => (
                  <Menu.Item
                    key={gid}
                    closeOnClick={false}
                    onClick={() => {
                      setParent((prev) => [path, ...prev]);
                      setPath(path[gid]);
                    }}
                    className={styles.submenubutton}
                  >
                    {gid} <FaCaretRight />
                  </Menu.Item>
                ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

const WithSpecificTarget: FC<{ target: Target }> = ({ target }) => {
  const [_reqs, setter] = useAtom(additionalRequirementsAtom);
  const reqs = _reqs[target] ?? [];

  return (
    <>
      <ResourceSelector target={target} />
      <table aria-label="Additional Requirements" className={styles.table}>
        <colgroup>
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">名称</th>
            <th scope="col">下限</th>
            <th scope="col">上限</th>
          </tr>
        </thead>
        <tbody>
          {reqs.map(([id, bounds]) => (
            <tr key={id}>
              <td>
                <button
                  onClick={() => {
                    setter(target, id, null);
                  }}
                >
                  <FaTrash />
                </button>
              </td>
              <td>{resource_list[id].name}</td>
              <td>
                <input
                  type="number"
                  value={bounds.min ?? ""}
                  placeholder="0"
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v)) setter(target, id, { min: v });
                    else setter(target, id, { min: undefined });
                  }}
                  className={styles.input}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={bounds.max ?? ""}
                  placeholder="inf"
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v)) setter(target, id, { max: v });
                    else setter(target, id, { max: undefined });
                  }}
                  className={styles.input}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export const AdditionalRequirements = () => {
  return (
    <>
      <h4>余剰生産量</h4>
      <WithSpecificTarget target="balance" />
      <h4>総生産量</h4>
      <WithSpecificTarget target="output" />
    </>
  );
};
