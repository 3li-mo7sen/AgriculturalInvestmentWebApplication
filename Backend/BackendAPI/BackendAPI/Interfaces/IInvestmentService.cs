// File: BackendAPI/Interfaces/IInvestmentService.cs
using BackendAPI.DTOs;
using BackendAPI.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendAPI.Interfaces
{
    public interface IInvestmentService
    {
        // =========================================================
        //                 INVESTMENT CORE OPERATIONS
        // =========================================================

        /// <summary>
        /// تنفيذ عملية استثمار جديدة والتحقق من الشروط المالية والمخاطر.
        /// </summary>
        Task<ServiceResult> InvestAsync(InvestDto dto);

        /// <summary>
        /// جلب جميع الاستثمارات الموجودة في النظام (للمسؤولين / الأدمن).
        /// </summary>
        // CHANGED: تم استبدال InvestmentViewDto بـ InvestmentDto الموحد
        Task<List<InvestmentDto>> GetAllAsync();

        /// <summary>
        /// جلب تفاصيل استثمار معين باستخدام المعرف الخاص به.
        /// </summary>
        // CHANGED: تم استبدال InvestmentViewDto بـ InvestmentDto الموحد
        Task<InvestmentDto?> GetByIdAsync(int id);

        /// <summary>
        /// جلب جميع الاستثمارات الخاصة بمستثمر معين عن طريق الـ ID.
        /// </summary>
        // CHANGED: تم استبدال InvestmentViewDto بـ InvestmentDto الموحد
        Task<List<InvestmentDto>> GetByInvestorAsync(int investorId);

        /// <summary>
        /// جلب الاستثمارات الحالية والمفتوحة للمستثمر تسجيل الدخول الحالي (لشاشة الـ Portfolio).
        /// </summary>
        // CHANGED: تم استبدال InvestmentViewDto بـ InvestmentDto الموحد
        Task<List<InvestmentDto>> GetMyInvestmentsAsync();

        /// <summary>
        /// جلب قائمة المستثمرين المشاركين في مشروع زراعي معين (تخدم شاشة المزارع والخبراء).
        /// </summary>
        Task<List<ProjectInvestorsDto>> GetProjectInvestorsAsync(int projectId);

        /// <summary>
        /// جلب السجل المالي التاريخي لمعاملات المستثمر الحالي (شحن، سحب، عوائد).
        /// </summary>
        Task<List<WalletTransactionDto>> GetMyHistoryAsync();


        // =========================================================
        //                    DIGITAL CONTRACTS
        // =========================================================

        /// <summary>
        /// جلب جميع العقود القانونية الرقمية في النظام.
        /// </summary>
        Task<List<ContractDto>> GetContractsAsync();

        /// <summary>
        /// جلب العقود الخاصة بالمستثمر الحالي المرتبطة باستثماراته المعتمدة.
        /// </summary>
        Task<List<ContractDto>> GetMyContractsAsync();

        /// <summary>
        /// جلب العقود القانونية الصادرة لمشروع زراعي معين.
        /// </summary>
        Task<List<ContractDto>> GetContractsByProjectAsync(int projectId);

        /// <summary>
        /// جلب تفاصيل عقد رقمي معين بالـ ID.
        /// </summary>
        Task<ContractDto?> GetContractByIdAsync(int id);

        /// <summary>
        /// تحديث حالة العقد (مثل: توقيع العقد من المستثمر أو المزارع Signed / Active).
        /// </summary>
        Task<ServiceResult> UpdateContractStatusAsync(int id, string status);


        // =========================================================
        //                    PROFIT & PAYOUTS
        // =========================================================

        /// <summary>
        /// حساب الأرباح المتوقعة أو الفعلية لدورة زراعية بناءً على نسبة الـ ROI للمشروع.
        /// </summary>
        Task<ProfitDto?> CalculateProfitAsync(int investmentId);

        /// <summary>
        /// توزيع الأرباح وإغلاق الاستثمار؛ تحول المبالغ مباشرة إلى محفظة المستثمر.
        /// </summary>
        Task<ServiceResult> DistributeProfitAsync(int investmentId);
    }
}