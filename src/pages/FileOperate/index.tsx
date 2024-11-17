import React from 'react';
import {Card, Button, Input, Row, Col, Space, Popover, Typography, InputNumber} from 'antd';
import { useState, useRef, useEffect } from'react';
import 'bootstrap/dist/css/bootstrap.min.css';// 引入Bootstrap
//

// 引入CSS文件
import './Styles/Textarea.css';
import './Styles/Canvas.css';
import './Styles/Button.css';
import './Styles/Other.css';

// 引入常量
import { indexClassColorMap, colorList } from './Constants/constants'
import CategoryDisplay from './Components/CategoryDisplay';

interface FileUploadProps {
  // 这里可以添加其他可能需要的属性，比如上传后的回调函数等，目前为空
}



const FileUpload: React.FC<FileUploadProps> = ({}) => {
  // 定义classIndexMap对象
  const [indexClassColorMapState, setIndexClassColorMapState] = useState(indexClassColorMap);

  // 存储不同类型文件的列表
  const [pngList, setPngList] = useState<File[]>([]);
  const [jpgList, setJpgList] = useState<File[]>([]);
  const [yoloList, setYoloList] = useState<File[]>([]);
  const [jsonList, setJsonList] = useState<File[]>([]);

  // currentYoloContentStateIndex 初始化为0 用于标识currentYoloContent的状态在堆栈中的位置
  const [currentYoloContentStateIndex, setcurrentYoloContentStateIndex] = useState<Map<number, number>>(new Map());

  // yoloContentHistoryStack 应该是一个map 然后key为数字 value为一个map key为currentStateIndex标识第几次操作 初始化为0
  const [yoloContentHistoryStack, setYoloContentHistoryStack] = useState<Map<number, Map<number, string[]>>>(new Map());

  // currentJsonContentStateIndex 初始化为0 用于标识currentJsonContent的状态在堆栈中的位置
  const [currentJsonContentStateIndex, setcurrentJsonContentStateIndex] = useState<number>(0);

  // jsonContentHistoryStack 应该是一个map 然后key为数字 value为一个map key为currentStateIndex标识第几次操作 初始化为0
  const [jsonContentHistoryStack, setJsonContentHistoryStack] = useState<Map<number, Map<number, string[]>>>(new Map());

  // 用于存储当前索引
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 用于储存用于展示/画框的file/string
  const [currentPng, setCurrentPng] = useState<File | null>(null);
  const [currentJpg, setCurrentJpg] = useState<File | null>(null);
  const [currentJsonContent, setCurrentJsonContent] = useState<string | null>(null);
  const [currentYoloContent, setCurrentYoloContent] = useState<string | null>(null);

  // 创建canvas元素的引用
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 创建textarea元素的引用
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 存储用于在canvas上绘制的yolo内容格式数组
  const [yoloContentToDrawOnCanvas, setYoloContentToDrawOnCanvas] = useState<string[]>([]);

  //region 类别序号 类别 类别颜色标识
  const [currentClassIndex, setCurrentClassIndex] = useState<number | null>(0);
  const [currentClassLabel, setCurrentClassLabel] = useState<string | null>(indexClassColorMapState[currentClassIndex]?.label || '');
  const [currentClassColor, setCurrentClassColor] = useState<string | null>(indexClassColorMapState[currentClassIndex]?.color || '');

  const [currentClassIndexToShow, setCurrentClassIndexToShow] = useState<number | null>(0);
  const [currentClassLabelToShow, setCurrentClassLabelToShow] = useState<string | null>(indexClassColorMapState[currentClassIndexToShow]?.label || '');
  const [currentClassColorToShow, setCurrentClassColorToShow] = useState<string | null>(indexClassColorMapState[currentClassIndexToShow]?.color || '');

  // 选择类别
  const selectCurrentClassByIndex = (classIndex: number) => {
    const selectedClass = indexClassColorMapState[classIndex];
    if (selectedClass) {
      setCurrentClassLabel(selectedClass.label);
      setCurrentClassIndex(classIndex);
      setCurrentClassColor(selectedClass.color);
    }
  };
  // endregion
/*
  创建函数用于解析和转换yolo内容成绝对位置的格式
  {classIndex x y w h} => {color leftTopX leftTopY rightBottomX rightBottomY}
*/
  const parseYoloContent = (relativeContent: string | null) => {
    const absoluteArray: string[] = [];
    if (relativeContent) {
      const relativeLines = relativeContent.split('\n');
      relativeLines.forEach((relativeLines) => {
        const relativeValues = relativeLines.split(' ');
        const relativeClassIndex = parseInt(relativeValues[0]);
        const relativeX = parseFloat(relativeValues[1]);
        const relativeY = parseFloat(relativeValues[2]);
        const relativeW = parseFloat(relativeValues[3]);
        const relativeH = parseFloat(relativeValues[4]);

        const absoluteLeftTopX = ((relativeX - relativeW / 2) * canvasRef.current!.width).toFixed(6);
        const absoluteLeftTopY = ((relativeY - relativeH / 2) * canvasRef.current!.height).toFixed(6);
        const absoluteRightBottomX = ((relativeX + relativeW / 2) * canvasRef.current!.width).toFixed(6);
        const absoluteRightBottomY = ((relativeY + relativeH / 2) * canvasRef.current!.height).toFixed(6);
        const auboluteColor = indexClassColorMapState[relativeClassIndex]?.color;
        if (auboluteColor) {
          absoluteArray.push(`${auboluteColor} ${absoluteLeftTopX} ${absoluteLeftTopY} ${absoluteRightBottomX} ${absoluteRightBottomY}`);
        }
      });
    }
    return absoluteArray;
  };
/*
  创建函数用于反向将绝对位置解析成相对位置的格式
  {color leftTopX leftTopY rightBottomX rightBottomY} => {classIndex x y w h}
*/
  const reverseParseYoloContent = (absoluteContent: string | null) => {
    const relativeArray: string[] = [];
    if (absoluteContent) {
      const absoluteLines = absoluteContent.split('\n');
      absoluteLines.forEach((absoluteLines) => {
        const absoluteColor = absoluteLines.split(' ')[0];
        const absoluteLeftTopX = parseFloat(absoluteLines.split(' ')[1]);
        const absoluteLeftTopY = parseFloat(absoluteLines.split(' ')[2]);
        const absoluteRightBottomX = parseFloat(absoluteLines.split(' ')[3]);
        const absoluteRightBottomY = parseFloat(absoluteLines.split(' ')[4]);

        const relativeX = ((absoluteLeftTopX + absoluteRightBottomX) / 2 / canvasRef.current!.width).toFixed(6);
        const relativeY = ((absoluteLeftTopY + absoluteRightBottomY) / 2 / canvasRef.current!.height).toFixed(6);
        const relativeW = ((absoluteRightBottomX - absoluteLeftTopX) / canvasRef.current!.width).toFixed(6);
        const relativeH = ((absoluteRightBottomY - absoluteLeftTopY) / canvasRef.current!.height).toFixed(6);

        const relativeClassIndex = Object.keys(indexClassColorMapState).find(key => indexClassColorMapState[key].color === absoluteColor) || '';

        relativeArray.push(`${relativeClassIndex} ${relativeX} ${relativeY} ${relativeW} ${relativeH}`);

      });
    }
    return relativeArray;
  }

  // region 撤回画框&&删除框 && 撤销删除框

  //处理撤回操作
    const [deletedBoxHistories, setDeletedBoxHistories] = useState<{ index: number; content: string }[]>([]);
  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      // 清除整个canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (currentPng) {
      const img = new Image();
      img.src = URL.createObjectURL(currentPng);

      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas && ctx) {
          // 将图片绘制到canvas上
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          if (ctx && currentYoloContent) {
            // 先解析currentYoloContent获取绘制信息
            const yoloContentToDrawUndo = parseYoloContent(currentYoloContent).slice(0,-1);

            // 遍历解析后的内容，逐个绘制框
            yoloContentToDrawUndo.forEach((item) => {
              const [colorUndo, leftTopXUndo, leftTopYUndo, rightBottomXUndo, rightBottomYUndo] = item.split(' ');

              ctx.beginPath();
              ctx.strokeStyle = colorUndo;
              ctx.rect(
                parseFloat(leftTopXUndo),
                parseFloat(leftTopYUndo),
                parseFloat(rightBottomXUndo) - parseFloat(leftTopXUndo),
                parseFloat(rightBottomYUndo) - parseFloat(leftTopYUndo)
              );
              ctx.stroke();// 绘制框
            });
          }
          // @ts-ignore
          setCurrentYoloContent(currentYoloContent?.split('\n').slice(0, -1).join('\n'))// 将currentYoloContent的最后一行删除
          // console.log('currentYoloContent' + currentYoloContent);
          // 因为操作到这里的时候set操作很少，所以几乎可以认为是实时的，不用放到useeffect中
        }
      };
      // 处理图片加载失败的情况
      img.onerror = () => {
        console.error('图片加载失败，无法完成撤销操作');
      };
    } else {
      console.error('当前没有可用于撤销操作的PNG图片');
    }
  };
  /*判断MouseDown坐标点是否在矩形框内*/
  const isPointInRectangle = (x: number, y: number, rect: { left: number, top: number, right: number, bottom: number }) => {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };
  const handleDeleteBox = () => {
    const canvas = canvasRef.current;
    if (canvas && currentYoloContent) {
      const rects = parseYoloContent(currentYoloContent).map((line) => {
        const [color, leftTopX, leftTopY, rightBottomX, rightBottomY] = line.split(' ');
        return {
          left: parseFloat(leftTopX),
          top: parseFloat(leftTopY),
          right: parseFloat(rightBottomX),
          bottom: parseFloat(rightBottomY)
        };
      });
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const mouseX = mouseDownCoords.x;
        const mouseY = mouseDownCoords.y;
        const rectToDeleteIndex = rects.findIndex((rect) => isPointInRectangle(mouseX, mouseY, rect));
        if (rectToDeleteIndex!== -1) {
          const lines = currentYoloContent.split('\n');
          const deletedBox = {
            index: rectToDeleteIndex,
            content: lines[rectToDeleteIndex]
          };
          const currentPictureIndex = currentIndex;
          // 将删除框信息添加到以currentIndex为键的Map中对应的数组里
          setDeletedBoxHistories(prev => {
            const newDeletedBoxHistories = new Map(prev);
            const currentDeletedBoxHistory = newDeletedBoxHistories.get(currentPictureIndex) || [];
            newDeletedBoxHistories.set(currentPictureIndex, [
              ...currentDeletedBoxHistory,
              deletedBox
            ]);
            return newDeletedBoxHistories;
          });
          const currentYoloContentDeleted = lines.filter((_, index) => index!== rectToDeleteIndex).join('\n');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const img = new Image();
          img.src = URL.createObjectURL(currentPng!);
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            if (currentYoloContentDeleted) {
              const yoloContentToDraw = parseYoloContent(currentYoloContentDeleted);
              yoloContentToDraw.forEach((item) => {
                const [color, leftTopX, leftTopY, rightBottomX, rightBottomY] = item.split(' ');
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.rect(
                  parseFloat(leftTopX),
                  parseFloat(leftTopY),
                  parseFloat(rightBottomX) - parseFloat(leftTopX),
                  parseFloat(rightBottomY) - parseFloat(leftTopY)
                );
                ctx.stroke();
              });
            }
            setCurrentYoloContent(currentYoloContentDeleted);
          };
          img.onerror = () => {
            console.error('图片加载失败，无法完成删除框操作');
          };
        }
      }
    }
  };

  /*
  *   撤销删除框
  */
  const handleDeleteBoxUndo = () => {
    const currentPictureIndex = currentIndex;
    const deletedBoxHistoriesMap = deletedBoxHistories;
    const currentDeletedBoxHistory = deletedBoxHistoriesMap.get(currentPictureIndex) || [];
    if (currentDeletedBoxHistory.length === 0) {
      console.log('No deleted boxes to restore for this picture');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx && currentPng) {
      const lastDeletedBox = currentDeletedBoxHistory[currentDeletedBoxHistory.length - 1];
      const lastDeletedIndex = lastDeletedBox.index;

      const lines = currentYoloContent.split('\n');
      lines.splice(lastDeletedIndex, 0, lastDeletedBox.content);
      const newYoloContent = lines.join('\n');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = new Image();
      img.src = URL.createObjectURL(currentPng);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const yoloContentToDraw = parseYoloContent(newYoloContent);
        yoloContentToDraw.forEach((item) => {
          const [color, leftTopX, leftTopY, rightBottomX, rightBottomY] = item.split(' ');
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.rect(
            parseFloat(leftTopX),
            parseFloat(leftTopY),
            parseFloat(rightBottomX) - parseFloat(leftTopX),
            parseFloat(rightBottomY) - parseFloat(leftTopY)
          );
          ctx.stroke();
        });

        setCurrentYoloContent(newYoloContent);
        // 更新以currentIndex为键的Map中对应的数组，移除已恢复的框
        setDeletedBoxHistories(prev => {
          const newDeletedBoxHistories = new Map(prev);
          const updatedCurrentDeletedBoxHistory = currentDeletedBoxHistory.slice(0, -1);
          newDeletedBoxHistories.set(currentPictureIndex, updatedCurrentDeletedBoxHistory);
          return newDeletedBoxHistories;
        });
      };

      img.onerror = () => {
        console.error('图片加载失败，无法完成恢复删除框操作');
      };
    }
  };
// endregion



 // region处理文件夹上传

  // 定义一个函数用于比较文件名中的数字部分，并按数字大小排序
  const compareFileNamesByNumber = (a: File, b: File) => {
    const aNameNumber = parseInt(a.name.match(/\d+/)?.[0] || '0');
    const bNameNumber = parseInt(b.name.match(/\d+/)?.[0] || '0');
    return aNameNumber - bNameNumber;
  };

  // 定义一个函数用于解析class文件内容并更新indexClassColorMapState
  const parseClassFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target) {
        const content = e.target.result as string;
        const lines = content.split('\n');
        lines.forEach((line) => {
          const [indexStr, className] = line.split(':');
          const index = parseInt(indexStr.trim());
          if (!isNaN(index) && indexClassColorMapState[index]) {
            // 更新indexClassColorMapState中相应索引的label（如果需要更新颜色等其他信息，在这里添加相应逻辑）
            setIndexClassColorMapState(prevMap => ({
              ...prevMap,
              [index]: {
                ...prevMap[index],
                label: className.trim()
              }
            }));
          }
        });
      }
    };
    reader.readAsText(file);
  };
  const handleFolderUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedFiles = Array.from(files);

      // 用于存储符合条件的png、jpg、yolo、json文件
      const newPngList: File[] = [];
      const newJpgList: File[] = [];
      const newYoloList: File[] = [];
      const newJsonList: File[] = [];

      uploadedFiles.forEach((file) => {
        if (/class/i.test(file.name)) {
          // 如果文件名包含class，处理该文件内容并更新indexClassColorMapState
          parseClassFile(file);
        } else {
          if (file.type.includes('image/png')) {
            newPngList.push(file);
          } else if (file.type.includes('image/jpeg')) {
            newJpgList.push(file);
          } else if (file.name.endsWith('.txt')) {
            newYoloList.push(file);
          } else if (file.name.endsWith('.json')) {
            newJsonList.push(file);
          }
        }
      });

      // 对文件列表进行排序
      newPngList.sort(compareFileNamesByNumber);
      newJpgList.sort(compareFileNamesByNumber);
      newYoloList.sort(compareFileNamesByNumber);
      newJsonList.sort(compareFileNamesByNumber);

      // 更新状态
      setPngList(prevPngList => {
        const updatedList = newPngList;
        console.log('pngList updated:', updatedList);
        return updatedList;
      });
      setJpgList(prevJpgList => {
        const updatedList = newJpgList;
        console.log('jpgList updated:', updatedList);
        return updatedList;
      });
      setYoloList(prevYoloList => {
        const updatedList = newYoloList;
        console.log('yoloList updated:', updatedList);
        return updatedList;
      });
      setJsonList(prevJsonList => {
        const updatedList = newJsonList;
        console.log('jsonList updated:', updatedList);
        return updatedList;
      });

      // 上传新文件后，重置当前显示的png文件索引为0
      setCurrentIndex(0);
      console.log('currentIndex reset to:', 0);
    }
  };
  // endregion

  // 将currentYoloContent内容保存到本地
  const handleSaveCurrentYoloContentToLocal = () => {
    if (currentYoloContent){
      const yoloContentToSave = currentYoloContent;
      const blob = new Blob([yoloContentToSave], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = yoloList[currentIndex].name;
      a.download = filename + '.txt';
      a.click();
    }
  }

  // region 用于初始化各个当前相关变量，当对应的列表状态更新时触发初始化操作

  // 监听pngList更新的useEffect
  useEffect(() => {
    if (pngList.length > 0) {
      setCurrentPng(pngList[currentIndex]);
    } else {
      setCurrentPng(null);
    }
  }, [pngList, currentIndex]);

  // 单独监听currentPng更新的useEffect
  useEffect(() => {
    if (currentPng) {
      console.log('currentPng has been updated successfully.' + currentPng.name);
      // 调用加载函数将更新后的currentPng加载到canvas上
      loadCurrentPngToCanvas(currentPng);
    }
  }, [currentPng]);

  // 监听jpgList更新的useEffect
  useEffect(() => {
    if (jpgList.length > 0) {
      setCurrentJpg(jpgList[currentIndex]);
    } else {
      setCurrentJpg(null);
    }
  }, [jpgList, currentIndex]);

  // 单独监听currentJpg更新的useEffect
  useEffect(() => {
    if (currentJpg) {
      console.log('currentJpg has been updated successfully.' + currentJpg);
    }
  }, [jpgList]);

  // 监听yoloList更新的useEffect
  useEffect(() => {
    // 用filerender将yoloList中的内容读取到currentYoloContent中
    if (yoloList.length > 0 && currentIndex >= 0 && currentIndex < yoloList.length) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target) {
          let content = e.target.result as string;
          // 对读取到的内容直接进行去除空行的处理
          const lines = content.split('\n');
          const nonEmptyLines = lines.filter(line => line.trim()!== '');
          const contentWithoutEmptyLines = nonEmptyLines.join('\n');
          // 将处理后的内容设置给currentYoloContent
          setCurrentYoloContent(contentWithoutEmptyLines);
        }
      }
      reader.readAsText(yoloList[currentIndex]);
    }
  }, [yoloList, currentIndex]);

// 单独监听currentYoloContent更新的useEffect
  useEffect(() => {
    console.log('currentYoloContent has been updated successfully.');
    // console.log('currentYoloContent:'+ currentYoloContent);
    // 在这里可以进行一些后续操作，比如基于更新后的currentYoloContent进行渲染或者其他逻辑处理

    // 由于 loadCurrentPngToCanvas中filerender 开始读取并不会等到读取完成再执行后续代码
    // 所以这里需要延迟10毫秒执行loadCurrentYoloContentToCanvas函数(这是一个比较简单的实现)
    setTimeout(() => {
        loadCurrentYoloContentToCanvas(currentYoloContent);
      }, 50) // 延迟10毫秒执行

  }, [currentYoloContent]);

  // 监听jsonList更新的useEffect
  useEffect(() => {
    // 用filerender将jsonList中的内容读取到currentJsonContent中
    if (jsonList.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target) {
          setCurrentJsonContent(e.target.result as string);
        }
      }
      reader.readAsText(jsonList[currentIndex]);
    }
  }, [jsonList, currentIndex]);

  // 单独监听currentJsonContent更新的useEffect
  useEffect(() => {
    console.log('currentJsonContent has been updated successfully.' + currentJsonContent);
  }, [currentJsonContent]);

  // endregion

  /*
  用于处理png文件到canvas的绘制
  */
  const loadCurrentPngToCanvas = (pngFile: File | null) => {
    if (pngFile) {
      const img = new Image();

      // 当图片加载完成时触发的回调函数
      img.onload = function () {
        // 获取当前的canvas元素引用
        const canvas = canvasRef.current;
        if (canvas) {
          // 获取canvas的2D上下文，用于绘制操作
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // 设置canvas的宽度为图片的宽度
            canvas.width = img.width;
            // 设置canvas的高度为图片的高度
            canvas.height = img.height;
            // 将加载完成的图片绘制到canvas上，从坐标(0, 0)开始绘制
            ctx.drawImage(img, 0, 0);
            // 输出日志表示图片已成功加载并绘制到canvas上
            console.log('Image has been loaded and drawn on canvas successfully.');
          }
        }
      };

      // 当图片加载失败时触发的回调函数
      img.onerror = function () {
        // 输出错误日志，表示图片加载失败
        console.error('Error loading the image.');
      };

      // 创建一个FileReader对象，用于读取文件内容
      const reader = new FileReader();

      // 当文件读取成功时触发的回调函数
      reader.onload = function (e) {
        // 将读取到的DataURL设置为图片的src，触发图片加载
        img.src = e.target?.result as string;
        // 输出日志表示文件已成功读取为DataURL
        console.log('File has been read successfully as DataURL.');
      };

      // 当文件读取失败时触发的回调函数
      reader.onerror = function () {
        // 输出错误日志，表示文件读取失败
        console.error('Error reading the file.');
      };

      // 开始读取文件，将文件内容转换为DataURL格式
      reader.readAsDataURL(pngFile);
      // 输出日志表示开始加载PNG文件
      console.log('Started loading the PNG file.');
    }
  };

  // 创建函数 用parseYoloContent解析currentYoloContent并按照规则在canvas上绘制框
  const loadCurrentYoloContentToCanvas = (yoloContentInput: string | null) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    // console.log('currentYoloContent:'+ currentYoloContent);
    // console.log('ctx:'+ ctx);
    console.log('loadCurrentYoloContentToCanvas:');

    if (ctx && yoloContentInput) {
      console.log('Ready to draw boxes on canvas');
      // 先解析currentYoloContent获取绘制信息
      const yoloContentToDraw = parseYoloContent(yoloContentInput);
      // 遍历解析后的内容，逐个绘制框
      yoloContentToDraw.forEach((item) => {
        const [color, leftTopX, leftTopY, rightBottomX, rightBottomY] = item.split(' ');

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.rect(
          parseFloat(leftTopX),
          parseFloat(leftTopY),
          parseFloat(rightBottomX) - parseFloat(leftTopX),
          parseFloat(rightBottomY) - parseFloat(leftTopY)
        );
        ctx.stroke();// 绘制框
        // console.log('Box drawn successfully');
      });
      console.log('Box drawn successfully');
    }
  };


// 抽象出保存currentYoloContent为文件并更新yoloList的函数
  const saveYoloContentAsFile = (index: number) => {
    const yoloContent = currentYoloContent;
    if (yoloContent) {
      const blob = new Blob([yoloContent], { type: 'text/plain' });
      const file = new File([blob], `yolo_${index}.txt`, { type: 'text/plain' });
      setYoloList(prevList => {
        const updatedList = [...prevList];
        updatedList[index] = file;
        return updatedList;
      });
    }
  };
  // 切换到下一个png文件及对应的txt文件内容
  const handleNextIndex = () => {
    if (currentIndex < pngList.length - 1) {
      saveYoloContentAsFile(currentIndex);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };
  // 切换到上一个png文件及对应的txt文件内容
  const handlePrevIndex = () => {
    if (currentIndex > 0) {
      saveYoloContentAsFile(currentIndex);
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  // 在textarea中显示带有行号的currentYoloContent
  const addLineNumbersToYoloContent = (content: string | null) => {
    if (content) {
      const lines = content.split('\n');
      const numberedLines = lines.map((line, index) => `${index + 1}. ${line}`);
      return numberedLines.join('\n');
    }
    return content;
  };

// region鼠标在canvas画布上绘制临时框的相关函数
// 存储鼠标按下时的坐标以及上一次鼠标移动时的坐标，用于计算框的大小和位置
  const [mouseDownCoords, setMouseDownCoords] = useState({ x: 0, y: 0 });
  const [prevMouseMoveCoords, setPrevMouseMoveCoords] = useState({ x: 0, y: 0 });

// 存储绘制框的临时数据，包含相对位置信息及对应的classIndex
  const [tempBoxData, setTempBoxData] = useState({
    relativeClassIndexTemp: currentClassIndex,
    relativeXTemp: 0,
    relativeYTemp: 0,
    relativeWTemp: 0,
    relativeHTemp: 0,
  });

// 鼠标按下事件处理函数
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setMouseDownCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setPrevMouseMoveCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });

      // 鼠标按下时，初始化tempBoxData中的相对位置信息为0，并设置对应的classIndex
      setTempBoxData({
        relativeClassIndexTemp: currentClassIndex,
        relativeXTemp: 0,
        relativeYTemp: 0,
        relativeWTemp: 0,
        relativeHTemp: 0,
      });
    }
  };

// 鼠标移动事件处理函数
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      // 根据鼠标移动更新临时框数据的相对位置信息
      setTempBoxData({
        relativeClassIndexTemp: currentClassIndex,
        relativeXTemp: Math.min(mouseDownCoords.x, currentX),
        relativeYTemp: Math.min(mouseDownCoords.y, currentY),
        relativeWTemp: Math.abs(currentX - mouseDownCoords.x),
        relativeHTemp: Math.abs(currentY - mouseDownCoords.y),
      });
      setPrevMouseMoveCoords({ x: currentX, y: currentY });

      // 获取当前鼠标所在位置对应的框的信息
      const rects = parseYoloContent(currentYoloContent).map((line) => {
        const [color, leftTopX, leftTopY, rightBottomX, rightBottomY] = line.split(' ');
        return {
          left: parseFloat(leftTopX),
          top: parseFloat(leftTopY),
          right: parseFloat(rightBottomX),
          bottom: parseFloat(rightBottomY)
        };
      });
      const rectUnderMouse = rects.find((rect) => isPointInRectangle(currentX, currentY, rect));
      if (rectUnderMouse) {
        // console.log('Mouse is in the box:', rectUnderMouse);
        // 如果鼠标在框内，获取框对应的类别信息
        const classIndex = Object.keys(indexClassColorMapState).find(key => indexClassColorMapState[key].color === rectUnderMouse.color);
        const currentClassLabel = indexClassColorMapState[classIndex]?.label || '';
        const currentClassColor = indexClassColorMapState[classIndex]?.color || '';

        setCurrentClassLabelToShow(currentClassLabel);
        setCurrentClassColorToShow(currentClassColor);

      }
    }
  };

  // 监听  setCurrentClassLabelToShow 和  setCurrentClassColorToShow
  useEffect(() => {
    console.log('currentClassLabelToShow:', currentClassLabelToShow);
    console.log('currentClassColorToShow:', currentClassColorToShow);
  }, [currentClassLabelToShow, currentClassColorToShow]);


// 鼠标松开事件处理函数
  const handleMouseUp = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { relativeXTemp, relativeYTemp, relativeWTemp, relativeHTemp } = tempBoxData;

        // 计算Yolo格式所需的归一化坐标和尺寸
        const x_center = (relativeXTemp + relativeWTemp / 2) / canvas.width;
        const y_center = (relativeYTemp + relativeHTemp / 2) / canvas.height;
        const box_width = relativeWTemp / canvas.width;
        const box_height = relativeHTemp / canvas.height;

        // 生成Yolo格式的一行数据
        const yoloFormatData = `${tempBoxData.relativeClassIndexTemp} ${x_center.toFixed(6)} ${y_center.toFixed(6)} ${box_width.toFixed(6)} ${box_height.toFixed(6)}`;

        // 将新生成的Yolo格式数据添加到currentYoloContent中
        if (box_width> 0.0001 && box_height> 0.0001) {
          // console.log('将新生成的Yolo格式数据添加到currentYoloContent中');
          setCurrentYoloContent(prevContent => prevContent + '\n' + yoloFormatData);
        }
        if (currentClassColor) {
          ctx.strokeStyle = currentClassColor;
        }
        ctx.beginPath();
        ctx.rect(relativeXTemp, relativeYTemp, relativeWTemp, relativeHTemp);
        ctx.stroke();
      }
    }

    // 清空临时框数据
    setTempBoxData({
      relativeClassIndexTemp: tempBoxData.relativeClassIndexTemp,
      relativeXTemp: 0,
      relativeYTemp: 0,
      relativeWTemp: 0,
      relativeHTemp: 0,
    });

    // 也可根据情况在这里进行其他后续操作，比如保存框的信息等
  };
// endregion

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log('Key pressed:', event.key);
      if (event.key === 'Backspace') {
        console.log('Backspace pressed');
        handleDeleteBox();
      }
    };

    // 在组件挂载时添加事件监听器
    document.addEventListener('keydown', handleKeyDown);

    // 在组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      {/* 第一行：上传按钮、上一个按钮、下一个按钮 */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <input
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFolderUpload}
            className="input-hidden-style"
            style={{ opacity: 0, width: 0, height: 0 }} // 隐藏input元素
          />
          <Button className="button-style" onClick={() => document.querySelector('input[type="file"]').click()}>上传文件夹</Button> {/* 通过点击此按钮触发文件选择input的点击事件 */}
          <Button className="button-style" onClick={() => loadCurrentYoloContentToCanvas(currentYoloContent)}>绘制框</Button>
          <Button className="button-style" onClick={handleUndo}>撤回</Button>
          <Button className="button-style" onClick={handleSaveCurrentYoloContentToLocal}>保存</Button>
          <Button className="button-style" onClick={handleDeleteBox} >删除框</Button>
          <Button className="button-style" onClick={handleDeleteBoxUndo}>恢复删除</Button>
          <Popover
            content={(
              <div style={{ maxHeight: '200px', overflowY:'scroll' }}>
                {Object.keys(indexClassColorMapState).map((classIndex) => {
                  const { color, label } = indexClassColorMapState[classIndex];
                  return (
                    <Button
                      key={classIndex}
                      onClick={() => selectCurrentClassByIndex(parseInt(classIndex))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: color === currentClassColor? 'lightgray' : 'transparent',
                        color: color === currentClassColor? 'black' : 'inherit',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: color,
                          marginRight: '5px',
                          borderRadius: '50%',
                        }}
                      ></div>
                      {`Index: ${classIndex}, Class: ${label}, Color: ${color}`}
                    </Button>
                  );
                })}
              </div>
            )}
            title={`${currentClassIndex} : [ ${currentClassLabel} ${currentClassColor}]`}
            trigger="click"
          >
            <Button className="button-style">类别</Button>
          </Popover>
        </div>
      </Card>

      {/* 第二行：上一个/下一个按钮、文件名、inputnumber框 */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Button className="button-style" onClick={handlePrevIndex}>上一个</Button>
          <Button className="button-style" onClick={handleNextIndex}>下一个</Button>
          当前文件: {currentPng?.name}
          <InputNumber
            value={currentIndex + 1}
            onChange={(value) => {
              const newIndex = parseInt(value);
              if (!isNaN(newIndex) && newIndex >= 0 && newIndex <= pngList.length) {
                setCurrentIndex(newIndex - 1);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                setCurrentIndex(0);
              }
            }}
            min={0}
            max={pngList.length}
            step={1}
            parser={(value) => parseInt(value)}
            style={{ width: '50px' }}
          />
          <span style={{ marginLeft: '10px', marginRight:'10px'}}>/ {yoloList.length}</span>
          {/* 展示当前选择的index class color，从左至右依次是颜色块 index class color */}
          {currentClassColor && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: currentClassColor,
                  marginRight: '5px',
                  borderRadius: '50%',
                }}
              ></div>
              <span>Index: {currentClassIndex}, Class: {currentClassLabel}, Color: {currentClassColor}</span>
            </div>
          )}
        </div>
      </Card>

      {/* 第三行：canvas画布和textarea */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <canvas
          ref={canvasRef}
          className="canvas-element"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        <textarea ref={textareaRef} // 这个textarea用于显示带有行号的currentYoloContent
                  value={addLineNumbersToYoloContent(currentYoloContent)}
                  className="custom-textarea"
        />
      </div>
      <div>
        {/* 其他组件和按钮 */}
        <div>{`当前类别: ${currentClassLabelToShow} (颜色: ${currentClassColorToShow})`}</div>
      </div>
    </div>
  );
}

export default FileUpload;
