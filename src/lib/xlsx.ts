import * as XLSX from 'xlsx';
import type { PortfolioStock } from '@/types/portfolio';

export const exportToExcel = (data: PortfolioStock[], fileName: string = 'Stoxian_Portfolio') => {
  // 1. Prepare data for the worksheet to match the UI table
  const worksheetData = data.map(stock => ({
    'Particulars': stock.name,
    'Sector': stock.sector,
    'Exchange': stock.exchange,
    'Purchase Price': stock.purchasePrice,
    'Qty': stock.quantity,
    'Investment': stock.investment,
    'Portfolio %': stock.portfolioPercentage / 100, // Keep as number for formatting
    'CMP': stock.marketData?.cmp,
    'Present Value': stock.presentValue,
    'Gain/Loss': stock.gainLoss,
    'P/E Ratio': stock.marketData?.peRatio,
    'Latest Earnings (EPS)': stock.marketData?.latestEarnings,
  }));

  // 2. Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
    header: [
      'Particulars', 'Sector', 'Exchange', 'Purchase Price', 'Qty', 'Investment',
      'Portfolio %', 'CMP', 'Present Value', 'Gain/Loss', 'P/E Ratio', 'Latest Earnings (EPS)'
    ]
  });

  // 3. Define column widths for better layout
  worksheet['!cols'] = [
    { wch: 25 }, // Particulars
    { wch: 18 }, // Sector
    { wch: 10 }, // Exchange
    { wch: 15 }, // Purchase Price
    { wch: 10 }, // Qty
    { wch: 15 }, // Investment
    { wch: 12 }, // Portfolio %
    { wch: 15 }, // CMP
    { wch: 15 }, // Present Value
    { wch: 15 }, // Gain/Loss
    { wch: 12 }, // P/E Ratio
    { wch: 20 }, // Latest Earnings (EPS)
  ];

  // 4. Apply number formatting to currency and percentage columns
  const currencyFormat = '"₹"#,##0.00';
  const percentageFormat = '0.00%';
  const numberFormat = '#,##0.00';

  const range = XLSX.utils.decode_range(worksheet['!ref'] as string);

  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const row = R + 1;
    // Currency Columns
    ['D', 'F', 'H', 'I', 'J'].forEach(col => {
      const cell = worksheet[col + row];
      if (cell) cell.z = currencyFormat;
    });
    // Percentage Column
    const percentCell = worksheet['G' + row];
    if (percentCell) percentCell.z = percentageFormat;
    // P/E Ratio Column
    const peCell = worksheet['K' + row];
    if (peCell) peCell.z = numberFormat;
  }

  // 5. Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Portfolio');

  // 6. Generate the file and trigger download
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}; 