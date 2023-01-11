import * as React from "react";
const SvgVideoIcon = (props) => (
  <svg
  viewBox="0 0 422 422"

    width={422}
    height={412}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <rect
      x={5}
      y={5.629}
      width={412}
      height={401.371}
      rx={10}
      fill="#BAAEAE"
      stroke="#000"
      strokeWidth={10}
    />
    <rect
      x={65.832}
      y={69.739}
      width={292.024}
      height={292.896}
      rx={112.5}
      fill="url(#videoIcon_svg__a)"
    />
    <defs>
      <pattern
        id="videoIcon_svg__a"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use
          xlinkHref="#videoIcon_svg__b"
          transform="matrix(.00446 0 0 .00444 -.001 0)"
        />
      </pattern>
      <image
        id="videoIcon_svg__b"
        data-name="image(edit).png"
        width={225}
        height={225}
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAAA+s9J6AAAAAXNSR0IArs4c6QAAHXxJREFUeF7tXXuIlVX3Xh+YaQxeKh0dsEw008RMUpPKwWlMv9BSM8XUEaEMywZHzcQp/zAUM00xQVDLvJRoooLiBW8p08UKrWmc1GTSLl7SSqHSSPj9WAdP3+k05+xnv3u/t/2uFyRo9vVZ+zl773Xb//nzzz//j+QTBASB0BD4j5AwNOylY0EghYCQ0PJC+O233+j777+nH374gb799luqq6ujy5cv19tL69at6eabb6aWLVtSYWEhdejQgZo3b06NGze2PCppLsoICAkNpcOk+/jjj1P/Nm3aRMeOHTNskah9+/bUr18/6t27d+pfmzZtjNuUBqKLgJDQg2x+/fVX2rZtG61bt4727dvnoQX9KjNmzKDHHnuMunXrpl9ZakQaASGhhngOHDhAb7/9Nq1fv16jlt2irVq1Iibkk08+mTq6yhd/BISEChleuXKF1qxZQ+Xl5ZGT9rhx41KElONq5ESjNSAhYQ64mHxvvfUWTZ06VQvQMApPmDCBpk+fnlLuyBc/BISE9chs7dq19PTTT8dOmrNmzaLJkydTgwYNYjf2JA9YSJgh/draWiopKaFLly7Fek3s2rWLiouLYz2HJA1eSHhd2gsWLKDKykpnZM/3xTfffFN2xRhINPEk5LvfE0884YupoVevXtSiRYuU4oQ1mWyYb9q0acp4/8cff6SM+RcuXEjZFk+ePOnLcjl8+DB17tzZl7alUTsIJJqEZ86coXbt2llBslmzZvTcc89Rz5496e677/aksWRPm6NHj9IHH3xA77zzjrVj8erVq2n48OFW5imN2EcgsST8+uuv6d577zVC9Pbbb6cpU6bQwIEDqaioyKit+iozKXfs2EErVqyg6upqo/bZlDFz5kyjNqSyPwgkkoSffvop9enTxzOiTLpp06aldr2gPlYaLV++nJYuXeq5S74nmtT33LFUzItA4kjIPp59+/b1tCweffRRmj17NnXq1MlTfRuV+Ai9ePFiWrRokafmRowYQatWrfJUVyr5g0CiSMhuZ/3799dGkh2q2V0tyJ1PNUg+qr788sueXOiEiCp0g/17YkjIx7nu3btro8s7H9/7ovpt3ryZRo4cqT28SZMm0dy5c7XrSQX7CCSChF6UMKx02bNn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"
      />
    </defs>
  </svg>
);
export default SvgVideoIcon;