import { useState } from "react";
import NumberScroll from "../../components/NumberScroll";
import { Button, Space, Progress } from "antd";
import useNumberScroll from "../../hooks/useNumberScroll";

export default function NumberScrollDemo() {
  const [numberValue, setNumberValue] = useState(100);
  const [currencyValue, setCurrencyValue] = useState(12345.67);
  const [progressValue, setProgressValue] = useState(68);

  // 使用 hook 获取进度条的当前值
  const { current: progressCurrentDisplay } = useNumberScroll({
    value: progressValue,
  });

  const { current: progressCurrentDisplayB } = useNumberScroll({
    value: Math.min(progressValue * 1.2, 100),
  });

  const { current: progressCurrentDisplayC } = useNumberScroll({
    value: Math.min(progressValue * 0.8, 100),
  });

  return (
    <div className="flex flex-col gap-8 font-Poppins">
      {/* 基础数字滚动演示 */}
      <div className="p-6 border border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">基础演示</h3>

        <div className="flex flex-col gap-6">
          {/* 数字展示区域 */}
          <div className="flex items-center gap-8">
            {/* 静态数字对比 */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-gray-500">静态</div>
              <div className="text-4xl font-bold text-gray-400 min-w-[120px] text-center">
                {numberValue.toFixed(2)}
              </div>
            </div>

            {/* 箭头 */}
            <div className="text-2xl text-gray-300">→</div>

            {/* 滚动数字展示 */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-gray-500">滚动</div>
              <div className="text-4xl font-bold text-blue-600 min-w-[120px] text-center">
                <NumberScroll
                  value={numberValue}
                  options={{ decimals: 1 }}
                  className="justify-center self-center"
                />
              </div>
            </div>
          </div>

          {/* 控制按钮区域 */}
          <div className="flex flex-col gap-3">
            <div className="text-sm text-gray-600 mb-2">快速测试</div>
            <Space wrap>
              <Button type="primary" onClick={() => setNumberValue(0)}>
                重置为 0
              </Button>
              <Button onClick={() => setNumberValue(100)}>100</Button>
              <Button onClick={() => setNumberValue(1000)}>1000</Button>
              <Button onClick={() => setNumberValue(10000)}>10000</Button>
              <Button onClick={() => setNumberValue(12345.67)}>12345.67</Button>
            </Space>
          </div>

          {/* 步进控制 */}
          <div className="flex flex-col gap-3">
            <div className="text-sm text-gray-600 mb-2">手动调节</div>
            <Space>
              <Button onClick={() => setNumberValue(numberValue - 1000)}>
                -1000
              </Button>
              <Button onClick={() => setNumberValue(numberValue - 100)}>
                -100
              </Button>
              <Button onClick={() => setNumberValue(numberValue - 10)}>
                -10
              </Button>
              <Button onClick={() => setNumberValue(numberValue + 10)}>
                +10
              </Button>
              <Button onClick={() => setNumberValue(numberValue + 100)}>
                +100
              </Button>
              <Button onClick={() => setNumberValue(numberValue + 1000)}>
                +1000
              </Button>
            </Space>
          </div>

          {/* 当前值显示 */}
          <div className="pt-3 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              当前目标值:{" "}
              <span className="font-mono font-semibold text-gray-700">
                {numberValue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 金融货币展示 */}
      <div className="p-6 border border-gray-300 rounded-lg bg-gradient-to-br from-blue-50 to-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">货币</h3>

        <div className="flex flex-col gap-6">
          {/* 人民币展示 */}
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium text-gray-600">
              人民币 (CNY)
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-red-500 font-semibold">¥</span>
              <div className="text-5xl font-bold text-red-600">
                <NumberScroll
                  value={currencyValue}
                  options={{ decimals: 2, split: "," }}
                  className="justify-center self-center"
                />
              </div>
            </div>
          </div>

          {/* 美元展示 */}
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium text-gray-600">美元 (USD)</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-green-500 font-semibold">$</span>
              <div className="text-5xl font-bold text-green-600">
                <NumberScroll
                  value={currencyValue * 7.2}
                  options={{ decimals: 2, split: "," }}
                  className="justify-center self-center"
                />
              </div>
            </div>
          </div>

          {/* 欧元展示 */}
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium text-gray-600">欧元 (EUR)</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-blue-500 font-semibold">€</span>
              <div className="text-5xl font-bold text-blue-600">
                <NumberScroll
                  value={currencyValue * 7.8}
                  options={{ decimals: 2, split: "," }}
                  className="justify-center self-center"
                />
              </div>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">快速设置金额</div>
            <Space wrap>
              <Button onClick={() => setCurrencyValue(0)}>¥0</Button>
              <Button onClick={() => setCurrencyValue(123.45)}>¥123.45</Button>
              <Button onClick={() => setCurrencyValue(1234.56)}>
                ¥1,234.56
              </Button>
              <Button onClick={() => setCurrencyValue(12345.67)}>
                ¥12,345.67
              </Button>
              <Button onClick={() => setCurrencyValue(123456.78)}>
                ¥123,456.78
              </Button>
              <Button onClick={() => setCurrencyValue(1234567.89)}>
                ¥1,234,567.89
              </Button>
              <Button onClick={() => setCurrencyValue(9999999.99)}>
                ¥9,999,999.99
              </Button>
            </Space>
          </div>

          {/* 手动调节 */}
          <div className="flex flex-col gap-3">
            <div className="text-sm text-gray-600 mb-2">手动调节</div>
            <Space>
              <Button onClick={() => setCurrencyValue(currencyValue - 10000)}>
                -¥10,000
              </Button>
              <Button onClick={() => setCurrencyValue(currencyValue - 1000)}>
                -¥1,000
              </Button>
              <Button onClick={() => setCurrencyValue(currencyValue - 100)}>
                -¥100
              </Button>
              <Button onClick={() => setCurrencyValue(currencyValue + 100)}>
                +¥100
              </Button>
              <Button onClick={() => setCurrencyValue(currencyValue + 1000)}>
                +¥1,000
              </Button>
              <Button onClick={() => setCurrencyValue(currencyValue + 10000)}>
                +¥10,000
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* 进度条数字滚动 */}
      <div className="p-6 border border-gray-300 rounded-lg bg-gradient-to-br from-purple-50 to-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">进度条</h3>

        <div className="flex flex-col gap-6">
          {/* 进度条展示 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                任务完成度
              </span>
              <div className="flex items-baseline gap-1">
                <div className="text-3xl font-bold text-purple-600">
                  {progressCurrentDisplay}
                </div>
                <span className="text-xl text-purple-600 font-semibold">%</span>
              </div>
            </div>
            <Progress
              percent={+progressCurrentDisplay}
              strokeColor={{
                "0%": "#a855f7",
                "100%": "#7c3aed",
              }}
              showInfo={false}
              type="dashboard"
              />
          </div>

          {/* 多个进度条示例 */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">项目A</span>
                <div className="flex items-baseline gap-1">
                  <div className="text-xl font-bold text-blue-600">
                    {progressCurrentDisplayB}
                  </div>
                  <span className="text-sm text-blue-600">%</span>
                </div>
              </div>
              <Progress
                percent={+progressCurrentDisplayB}
                strokeColor="#3b82f6"
                showInfo={false}
                type="dashboard"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">项目B</span>
                <div className="flex items-baseline gap-1">
                  <div className="text-xl font-bold text-green-600">
                    {progressCurrentDisplayC}
                  </div>
                  <span className="text-sm text-green-600">%</span>
                </div>
              </div>
              <Progress
                percent={+progressCurrentDisplayC}
                strokeColor="#10b981"
                showInfo={false}
                type="dashboard"
              />
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">快速设置进度</div>
            <Space wrap>
              <Button onClick={() => setProgressValue(0)}>0%</Button>
              <Button onClick={() => setProgressValue(25)}>25%</Button>
              <Button onClick={() => setProgressValue(50)}>50%</Button>
              <Button onClick={() => setProgressValue(68)}>68%</Button>
              <Button onClick={() => setProgressValue(75)}>75%</Button>
              <Button onClick={() => setProgressValue(90)}>90%</Button>
              <Button onClick={() => setProgressValue(100)}>100%</Button>
            </Space>
          </div>

          {/* 手动调节 */}
          <div className="flex flex-col gap-3">
            <div className="text-sm text-gray-600 mb-2">手动调节</div>
            <Space>
              <Button
                onClick={() =>
                  setProgressValue(Math.max(0, progressValue - 10))
                }
              >
                -10%
              </Button>
              <Button
                onClick={() => setProgressValue(Math.max(0, progressValue - 5))}
              >
                -5%
              </Button>
              <Button
                onClick={() =>
                  setProgressValue(Math.min(100, progressValue + 5))
                }
              >
                +5%
              </Button>
              <Button
                onClick={() =>
                  setProgressValue(Math.min(100, progressValue + 10))
                }
              >
                +10%
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
}
