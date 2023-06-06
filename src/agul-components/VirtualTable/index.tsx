import { Table } from "antd";
import type { TableProps } from "antd";
import classNames from "classnames";
import ResizeObserver from "rc-resize-observer";
import React, { useEffect, useRef, useState } from "react";
import { VariableSizeGrid } from "react-window";
import "./index.less";

const Grid: any = VariableSizeGrid;
const VirtualTable = <RecordType extends object>(
  props: TableProps<RecordType>
) => {
  const { columns, scroll } = props;
  const [tableWidth, setTableWidth] = useState(0);

  const widthColumnCount = columns!.filter(({ width }) => !width).length;
  const mergedColumns = columns!.map((column) => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  const gridRef = useRef<any>();
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, "scrollLeft", {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  useEffect(() => resetVirtualGrid, [tableWidth]);

  const renderVirtualList = (
    rawData: object[],
    { scrollbarSize, ref, onScroll }: any
  ) => {
    ref.current = connectObject;
    const totalHeight: number = rawData.length * 54;

    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index];
          return totalHeight > (scroll!.y as number) &&
            index === mergedColumns.length - 1
            ? (width as number) - scrollbarSize - 1
            : (width as number);
        }}
        height={scroll!.y as number}
        rowCount={rawData.length}
        rowHeight={() => 54}
        width={tableWidth}
        onScroll={({ scrollLeft }: { scrollLeft: number }) => {
          onScroll({ scrollLeft });
        }}
      >
        {({
          columnIndex,
          rowIndex,
          style,
        }: {
          columnIndex: number;
          rowIndex: number;
          style: React.CSSProperties;
        }) => (
          <div
            className={classNames("agul-virtual-table-cell", {
              "virtual-table-cell-last":
                columnIndex === mergedColumns.length - 1,
            })}
            style={style}
          >
            {(mergedColumns as any)[columnIndex].render
              ? (mergedColumns as any)[columnIndex].render(
                  (rawData[rowIndex] as any)[
                    (mergedColumns as any)[columnIndex].dataIndex
                  ],
                  rawData[rowIndex] as any,
                  rowIndex
                )
              : (rawData[rowIndex] as any)[
                  (mergedColumns as any)[columnIndex].dataIndex
                ]}
          </div>
        )}
      </Grid>
    );
  };
  // const headerWrapper = () => {
  //   return (
  //     <thead className="ant-table-thead">
  //       <tr>
  //         {mergedColumns.map(({ title, width }) => (
  //           <th className="ant-table-cell" style={{ width }}>
  //             {title}
  //           </th>
  //         ))}
  //       </tr>
  //     </thead>
  //   );
  // };
  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        className="agul-virtual-table"
        columns={mergedColumns}
        pagination={false}
        components={
          {
            // header: {
            //   wrapper: headerWrapper,
            // },
            body: renderVirtualList,
          } as any
        }
      />
    </ResizeObserver>
  );
};

export default VirtualTable;
